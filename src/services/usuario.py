from database import agregar_usuario, verificar_usuario
from models import User

def registrar_usuario(nombre, correo, password_plain):
    ok = agregar_usuario(nombre, correo, password_plain)
    if ok:
        print("Usuario registrado correctamente.")
        return True
    else:
        print("Error al registrar usuario.")
        return False

def iniciar_sesion(correo, password_plain):
    datos = verificar_usuario(correo, password_plain)
    if datos is None:
        print("Usuario o contraseña incorrectos.")
        return None
    else:
        print("✅ Usuario inició sesión correctamente.")
        usuario = User(datos['nombre'], datos['correo'], datos.get('password_hash'), uid=datos.get('id'))
        # No es buena práctica devolver el password en texto; devolvemos la instancia con el hash si se necesita
        return usuario
