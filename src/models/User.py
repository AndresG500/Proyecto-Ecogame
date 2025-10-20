class User:
    def __init__(self, nombre, correo, password_hash=None, uid=None):
        self.nombre = nombre
        self.correo = correo
        self.password_hash = password_hash
        self.uid = uid

    def to_dict(self):
        return {
            'nombre': self.nombre,
            'correo': self.correo,
            'password_hash': self.password_hash
        }
