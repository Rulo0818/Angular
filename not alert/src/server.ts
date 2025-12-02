import express from "express";
import notificacionesRoutes from "./routes/NotificacionesRoutes";
import alertasRoutes from "./routes/AlertasRoutes";
import { AppDataSource } from "./config/data-source";
import "reflect-metadata";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// CORS - Permitir todas las solicitudes desde el frontend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Notificaciones y Alertas funcionando',
        endpoints: {
            notificaciones: '/notificaciones',
            alertas: '/alertas'
        }
    });
});

// Rutas
app.use('/notificaciones', notificacionesRoutes);
app.use('/alertas', alertasRoutes);

// Inicializar BD + servidor
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully");
        console.log(`📊 Database: ${process.env.DB_NAME || 'notificaciones_alertas'}`);
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to database:", err);
        console.error("💡 Verifica tu archivo .env y que MySQL esté corriendo");
    });
