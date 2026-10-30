import uvicorn
from app.config import settings
import os # Añade esto

if __name__ == "__main__":
    # Render asigna un puerto dinámico, si no existe usamos el 8000
    port = int(os.environ.get("PORT", 8000)) 
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False, # Forzamos False en producción para evitar problemas
        log_level="debug" if settings.DEBUG else "info",
    )