# Plataforma de Datos multimodales
Este repositorio contendrá el código implementado para el TFG titulado "Plataforma basada en microservicios para tratamiento de datos multimodales conInteligencia Artificial"

# Requisitos

* Python 3.12
* Node 10.9
* Docker

# Instalación

Despúes de clonar el repositorio, recomendamos crear un entorno virtual e instalar las dependencias 

```bash
pip install -r requirements.txt
```

Para inicializar la base de datos hará falta ejecutar el comando de django 

```bash
cd multimodal-web-app
python manage.py migrate
```

Es necesario una instancia de RabbitMq corriendo. Se puede instalar siguiendo la guía oficial https://www.rabbitmq.com/docs/install-windows, pero recomendamos descargar una imagen de docker de RabbitMq.

# Uso
Para iniciar la aplicación en local debemos levantar 3 diferentes sistemas
* Backend de Django
* Gesto de tareas Celery
* Frontend en React+Vite

Para iniciar el backend simplemente tendremos que ejecutar:

```bash
cd multimodal-web-app
python manage.py runserver
```

Para iniciar el frontend tendremos que ejecutar:

```bash
cd multimodal-web-app\multimodal-client
npm run dev
```

Para iniciar el gesto de tareas de celery deberemos tener primero una instancia de Rabbit ejecutandose (ya sea mediante instalacion manual o una imagen de docker) y ejecutar

```bash
cd multimodal-web-app
celery -A MultimodalWebApp worker -l INFO
```

Si estamos ejecutando la aplicacion en windows deberemos añadirle el siguiente parámetro debido a que celery ha dejado de darle soporte a este sistema

```bash
cd multimodal-web-app
celery -A MultimodalWebApp worker -l INFO --pool=solo  
```