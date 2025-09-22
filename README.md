# 👥 Guía para colaboradores

Este proyecto usa **ramas por persona** para trabajar en paralelo sin romper la rama principal (`main`).

## 🔑 Configuración inicial de SSH para GitHub

Para evitar tener que escribir usuario y contraseña cada vez que trabajes con GitHub, se recomienda usar **llaves SSH**.

### 1️⃣ Verificar si ya tienes una llave SSH

En la terminal, ejecuta:

```bash
ls -al ~/.ssh
```

Si ves archivos como id_rsa.pub o id_ed25519.pub, ya tienes una clave creada.

### 2️⃣ Crear una nueva llave SSH

Ejecuta:

`ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"`

Presiona Enter en todas las preguntas (puedes dejar la passphrase vacía si prefieres no escribirla cada vez).

Esto generará dos archivos en ~/.ssh/:

- `id_ed25519` (tu clave privada, no la compartas nunca)
- `id_ed25519.pub` (tu clave pública, esta sí la vas a copiar a GitHub)

### 3️⃣ Iniciar el agente SSH y agregar tu llave

Ejecuta:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 4️⃣ Copiar la llave pública

Ejecuta:

`cat ~/.ssh/id_ed25519.pub`

Copia todo el contenido que aparece.

### 5️⃣ Agregar la clave a GitHub

1. Ve a [GitHub → Settings → SSH and GPG keys](https://github.com/settings/keys)
2. Haz clic en New SSH key
3. Pega la clave pública que copiaste.

### 6️⃣ Probar la conexión

Ejecuta:

`ssh -T git@github.com`

Si todo está bien, deberías ver un mensaje parecido a:

`Hi tu-usuario! You've successfully authenticated, but GitHub does not provide shell access.`

✅ Con esto, ya puedes clonar repositorios usando la llave SSH, proceso que se indicara a continuación:

## Descargar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone git@github.com:Prietosk1/lab-1-ed2.git
cd lab-1-ed2
```

### 2️⃣ Cambiarse a su rama personal

Cada colaborador tendrá una rama con su nombre.
Ejemplo para `juan`:

```bash
git fetch --all //Comando para traer todas las ramas existentes
git checkout juan
```

### 3️⃣ Subir cambios

Haz commits en tu rama y súbelos con:

```bash
git add .
git commit -m "feat: agrega nueva funcionalidad"
git push
```

### 4️⃣ Traer cambios de la rama principal

Si necesitas actualizar tu rama con lo último de main:

```bash
git checkout juan
git pull origin main
```

## Convenciones de Commits

Este proyecto sigue un formato de mensajes de commit inspirado en [Conventional Commits](https://www.conventionalcommits.org/).

### Estructura del commit

`<tipo>(alcance opcional): <descripción corta>`

### Tipos comunes

- **feat**: Nueva funcionalidad.
- **fix**: Corrección de un error.
- **docs**: Cambios en la documentación.
- **style**: Cambios de formato (espacios, comas, puntos y coma, etc.) que no afectan el código.
- **refactor**: Cambios en el código que no corrigen errores ni agregan funcionalidades.
- **test**: Añadir o modificar pruebas.
- **chore**: Cambios en tareas de build, dependencias u otras tareas de mantenimiento.

### Ejemplos

```
feat(auth): agregar login con JWT
fix(api): corregir error 500 al enviar formulario
docs(readme): actualizar instrucciones de instalación
style: aplicar prettier a archivos .ts y .tsx
```

Esto nos ayuda a mantener un historial de cambios **claro y ordenado**.

## 🔧 Extensiones recomendadas (VS Code)

Para mantener una experiencia de desarrollo consistente, recomendamos instalar las siguientes extensiones:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Code Spell Checker** (`streetsidesoftware.code-spell-checker`)
- _(opcional)_ **GitLens** (`eamodio.gitlens`)
