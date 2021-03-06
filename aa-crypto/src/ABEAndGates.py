from charm.toolbox.pairinggroup import PairingGroup, ZR, G1, G2, GT, pair
from charm.toolbox.bitstring import getBytes
from charm.core.engine.util import bytesToObject, serializeObject, to_json
from Crypto import Random
from Crypto.Cipher import AES
import sys, hashlib, base64, json, zlib
from ABEClass import ABE

class ABEAndGates(ABE):
    """ Simple Attribute Authority Cryptography with AND-Gates without any features """
    def __init__(self):
        super().__init__()
        self.bs = 32
        self.group = PairingGroup('SS512')

    def Setup(self):
        g, w = self.group.random(G1), self.group.random()
        Y = pair(g, g) ** w

        a_private, a_private_lids, a_private_star = [], [], []
        A_public, A_public_lids, A_public_star = [], [], []

        for i in range(len(self.attributes)):
            a_private.append(self.group.random())
            a_private_lids.append(self.group.random())
            a_private_star.append(self.group.random())
            A_public.append(g ** a_private[i])
            A_public_lids.append(g ** a_private_lids[i])
            A_public_star.append(g ** a_private_star[i])

        PK = {'g': g, 'Y': Y, 'A': A_public, 'A_lids': A_public_lids, 'A_star': A_public_star}
        MK = {'w': w, 'a': a_private, 'a_lids': a_private_lids, 'a_star': a_private_star}
        return (MK, PK)        

    def GenerateSecretKey(self, MK, PK, attr):
        L = self.GetAttributesMask(attr)
        D, s = [], 0

        for i in range(len(L)):
            si = self.group.random()
            s += si
            di = []
            if L[i] == 1:
                di.append(PK['g'] ** (si / MK['a'][i]))
            elif L[i] == 0:
                di.append(PK['g'] ** (si / MK['a_lids'][i]))
            else:
                raise "Invalid attribute mark!"
            di.append(PK['g'] ** (si / MK['a_star'][i]))
            D.append(di)

        D_zero = PK['g'] ** (MK['w'] - s)
        SK = {'D_zero': D_zero, 'D': D}
        return SK        

    def Encrypt(self, PK, message, attr):
        M = self.group.random(GT)
        key = hashlib.sha256(self.objectToBytes(M, self.group)).digest()
        raw = self._pad(message)
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        EncryptedMessage = base64.b64encode(iv + cipher.encrypt(raw))
        CT = self.EncryptABE(PK, M, attr)
        return (CT, EncryptedMessage)      

    def Decrypt(self, EncryptedMessage, SK, CT):
        M = self.DecryptABE(SK, CT)
        key = hashlib.sha256(self.objectToBytes(M, self.group)).digest()
        enc = base64.b64decode(EncryptedMessage)
        iv = enc[:AES.block_size]
        cipher = AES.new(key, AES.MODE_CBC, iv)
        DecryptedMessage = self._unpad(cipher.decrypt(enc[AES.block_size:])).decode('utf-8')
        return DecryptedMessage

    def EncryptABE(self, PK, M, attr):
        W = self.GetAttributesMask(attr)
        r = self.group.random()
        C_wave = (PK['Y'] ** r) * M
        C_zero = PK['g'] ** r
        C = []
        for i in range(len(W)):
            if W[i] == 1:
                C.append(PK['A'][i] ** r)
            elif W[i] == 0:
                C.append(PK['A_lids'][i] ** r)
            elif W[i] == -1:
                C.append(PK['A_star'][i] ** r)
            else:
                raise "Incorrect attribute mask!"
        CT = {'C_zero': C_zero, 'C_wave': C_wave, 'C': C, 'W': W}
        return CT

    def DecryptABE(self, SK, CT):
        if len(CT['W']) != len(SK['D']):
            raise "Incorrect length of cipher text!"
        z = 1
        for i in range(len(CT['W'])):
            if CT['W'][i] == -1:
                val = pair(CT['C'][i], SK['D'][i][1])
            elif CT['W'][i] == 0 or CT['W'][i] == 1:
                val = pair(CT['C'][i], SK['D'][i][0])
            else:
                raise "Incorrect ciphertext attributes!"
            z *= val

        res = CT['C_wave'] / (pair(CT['C_zero'], SK['D_zero']) * z)
        return res

    def Serialize(self, OriginalObject):
        return self.objectToBytes(OriginalObject, self.group)

    def Deserialize(self, RawObject):
        return bytesToObject(RawObject, self.group)

    def objectToBytes(self, object, group):
        object_ser = serializeObject(object, group)
        result = getBytes(json.dumps(object_ser, default=to_json, sort_keys = True))
        return base64.b64encode(zlib.compress(result))

    def GetAttributesMask(self, attr):
        """ Return int array for and-gate attributes, 0 - not used, 1 - used """
        res = []
        for attribute in self.attributes:
            if attribute in attr:
                res.append(1)
            else:
                res.append(0)
        return res

    def _pad(self, s):
        return s + (self.bs - len(s) % self.bs) * chr(self.bs - len(s) % self.bs)

    def _unpad(self, s):
        return s[:-ord(s[len(s)-1:])]

def main():
    print('ABE scheme for AA TEST')
    Message = 'Internet'
    print('Plain text: ' + Message)

    center = ABEAndGates()
    center.SetAttributesList(["Teapot", "Lamp", "Door", "Microwave", "WaterTap", "Washer", "Ventilator"])
    MK, PK = center.Setup()
    SK = center.GenerateSecretKey(MK, PK, ["Teapot"])   
    
    CT, EncryptedMessage = center.Encrypt(PK, Message, ["Teapot"])
    CT1 = center.Serialize(CT)
    assert center.Decrypt(EncryptedMessage, SK, center.Deserialize(CT1)) == Message, "Failed decryption!"
    
    CT, EncryptedMessage = center.Encrypt(PK, Message, ["Teapot", "Lamp"])
    SK1 = center.Serialize(SK)
    assert center.Decrypt(EncryptedMessage, center.Deserialize(SK1), CT) != Message, "Failed decryption!"

    Message = 'Very long text with usefull words: aaaaaaaa bbbbbbbbbb ccccccccccccc dddddddddddddddd eeeeeeeeeeeeeeeee ffffffffffffffffffffffff'
    CT, EncryptedMessage = center.Encrypt(PK, Message, ["Teapot"])
    assert center.Decrypt(EncryptedMessage, SK, CT) == Message, "Failed decryption!"    

if __name__ == "__main__":
    main()