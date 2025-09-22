## 👥 Guía para colaboradores

Este proyecto usa **ramas por persona** para trabajar en paralelo sin romper la rama principal (`main`).

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
git checkout pepito
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
