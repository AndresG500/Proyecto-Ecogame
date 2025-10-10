from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

app.secret_key = "key"

@app.route("/")
def login():
    return render_template('formulario.html')

@app.route("/juego1")
def juego1():
    return render_template('juego1.html')

@app.route("/juego2")
def juego2():
    return render_template('juego2.html')

@app.route("/clothe")
def clothe():
    return render_template('clothe.html')

@app.route("/juego3")
def juego3():
    return render_template('juego3.html')

if __name__ == "__main__":
    app.run(debug=True)