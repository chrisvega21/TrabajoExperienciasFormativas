from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

FILE = "inventario.json"

# Cargar inventario desde el archivo
def cargar_inventario():
    try:
        with open(FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

# Guardar inventario en el archivo
def guardar_inventario(inventario):
    with open(FILE, "w") as file:
        json.dump(inventario, file, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/productos", methods=["GET"])
def obtener_productos():
    inventario = cargar_inventario()
    return jsonify(inventario)

@app.route("/api/productos", methods=["POST"])
def agregar_producto():
    inventario = cargar_inventario()
    data = request.get_json()
    nombre = data.get("nombre")
    cantidad = data.get("cantidad")
    precio = data.get("precio")
    
    if nombre in inventario:
        return jsonify({"error": f"El producto '{nombre}' ya existe."}), 400

    inventario[nombre] = {"cantidad": cantidad, "precio": precio}
    guardar_inventario(inventario)
    return jsonify({"message": "Producto agregado exitosamente."}), 200

@app.route("/api/productos/<nombre>", methods=["DELETE"])
def eliminar_producto(nombre):
    inventario = cargar_inventario()
    if nombre not in inventario:
        return jsonify({"error": f"El producto '{nombre}' no existe."}), 404

    del inventario[nombre]
    guardar_inventario(inventario)
    return jsonify({"message": "Producto eliminado exitosamente."}), 200

if __name__ == "__main__":
    app.run(debug=True)
