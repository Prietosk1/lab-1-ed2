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

```feat(auth): agregar login con JWT
fix(api): corregir error 500 al enviar formulario
docs(readme): actualizar instrucciones de instalación
style: aplicar prettier a archivos .ts y .tsx
```

Esto nos ayuda a mantener un historial de cambios **claro y ordenado**.
