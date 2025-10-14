# database.py
import os
import firebase_admin
from firebase_admin import credentials, firestore
import bcrypt

def conexion_firebase(cred_path=None):
    try:
        if cred_path is None:
            cred_path = ("proyecto-ubicua-9bbba-firebase-adminsdk-fbsvc-358a889334.json")

        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        client = firestore.client()
        print("Se ha conectado a Firestore")
        return client

    except FileNotFoundError:
        print("Error: No se encontró el archivo de credenciales:", cred_path)
        return None
    except Exception as e:
        print("✗ Error: No se pudo establecer conexión con Firebase")
        print("  Detalles:", e)
        return None

def agregar_usuario(nombre, correo, password_plain):
    conexion = conexion_firebase()
    if conexion is None:
        return False
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_plain.encode('utf-8'), salt).decode('utf-8')

        doc_ref = conexion.collection('Usuarios').document()
        doc_ref.set({
            'nombre': nombre,
            'correo': correo,
            'password_hash': hashed
        })
        return True
    except Exception as ex:
        print("Error al agregar usuario:", ex)
        return False

def verificar_usuario(correo, password_plain):
    conexion = conexion_firebase()
    if conexion is None:
        return None
    try:
        q = conexion.collection('Usuarios').where('correo', '==', correo).limit(1).get()
        if not q:
            return None
        doc = q[0]
        data = doc.to_dict()
        password_hash = data.get('password_hash')
        if not password_hash:
            return None

        if bcrypt.checkpw(password_plain.encode('utf-8'), password_hash.encode('utf-8')):
            return {
                'id': doc.id,
                'nombre': data.get('nombre'),
                'correo': data.get('correo'),
                'password_hash': password_hash
            }
        else:
            return None
    except Exception as ex:
        print("Error en verificar_usuario:", ex)
        return None
