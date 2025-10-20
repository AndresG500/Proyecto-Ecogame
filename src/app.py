from flask import Flask, render_template, redirect, session, url_for

app = Flask(__name__)

app.secret_key = "your_secret_key"

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/formlogin")
def formlogin():
    return render_template("formulario.html")

@app.route("/formregister")
def formregister():
    return render_template("formulario.html")

@app.route("/juego")
def juego():
    return render_template("juego.html")

@app.route("/juego2")
def juego2():
    return render_template("juego2.html")

@app.route("/juego3")
def juego3():
    return render_template("juego3.html")

@app.route("/ecogame")
def ecogame():
    return render_template("ecogame.html")

if __name__ == "__main__":
    app.run(debug=True)