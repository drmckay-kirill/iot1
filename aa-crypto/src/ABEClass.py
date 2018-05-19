class ABE:
    def __init__(self):
        self.PK = {}
        self.MK = {}
        self.attributes = []
    def GetPK(self):
        return self.PK
    def GetAttributesList(self):
        return self.attributes
    def SetAttributesList(self, attributes):
        self.attributes = attributes
    def Setup(self):        
        raise NotImplementedError('ABE is supposed to be a parent class without funcionalities!')
    def GenerateSecretKey(self, MK, PK, attr):
        raise NotImplementedError('ABE is supposed to be a parent class without funcionalities!')
    def Encrypt(self, PK, message, attr):
        raise NotImplementedError('ABE is supposed to be a parent class without funcionalities!')
    def Decrypt(self, SK, CT):
        raise NotImplementedError('ABE is supposed to be a parent class without funcionalities!')
