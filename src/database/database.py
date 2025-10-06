import firebase_admin
from firebase_admin import credentials, firestore, db
def conexion():
    creed = credentials.Certificate("src/pruebas-a8c99-firebase-adminsdk-fbsvc-fcfd74b9fc.json")
    firebase_admin.initialize_app(creed)
    db = firestore.client()
    print("Conexión a Firestore establecida.")

def agregar_usuario(nombre, correo, contrasena):
    conexion = conexion()
    doc_ref = db.collection("Usuarios").document()
    doc_ref.set({
        "Nombre": nombre,
        "Correo": correo,
        "Contrasena": contrasena
    })
    return doc_ref.id

def verificar_usuario(correo, contrasena):
    conexion = conexion()
    doc_ref = db.collections("Usuarios").where("Correo", "==", correo).where("Contrasena","==",contrasena)
    