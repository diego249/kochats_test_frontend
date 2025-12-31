"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Network, Database, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function SecurityHelpPage() {
  const { language } = useLanguage()

  const copy = {
    es: {
      title: "Seguridad y protección de datos",
      subtitle: "Aprende cómo protegemos tus datos y garantizamos conexiones seguras",
      alert:
        "Nos tomamos la seguridad de los datos muy en serio. Todas las credenciales de base de datos se cifran y tus datos nunca se replican ni almacenan en nuestros servidores.",
      readOnly: {
        title: "Usuarios de base de datos de solo lectura",
        whyTitle: "¿Por qué acceso de solo lectura?",
        why: "Al conectar una base de datos, las credenciales que proporciones deben tener permisos de solo lectura. Así, incluso ante accesos no autorizados, nadie puede modificar o eliminar datos.",
        howTitle: "Cómo crear un usuario de solo lectura:",
        pgLabel: "-- Para PostgreSQL:",
      },
      encryption: {
        title: "Cifrado de credenciales",
        howTitle: "Cómo protegemos las credenciales:",
        bullets: [
          "Todas las credenciales (usuario, contraseña, host) se cifran con algoritmos estándar de la industria",
          "Las llaves de cifrado se gestionan de forma segura y nunca se almacenan junto a los datos cifrados",
          "Las credenciales cifradas se almacenan en nuestra base con controles de acceso adicionales",
          "Solo se descifran al establecer conexiones con tu base de datos",
        ],
      },
      remote: {
        title: "Solo conexiones remotas",
        noData: "Sin replicación de datos:",
        intro: "Usamos conexiones remotas, lo que significa:",
        bullets: [
          "Tus datos nunca se copian ni se replican en nuestros servidores",
          "Las consultas se ejecutan directamente contra tu base de datos en tiempo real",
          "Los resultados se procesan temporalmente y no se almacenan de forma permanente",
          "Tus datos permanecen bajo tu control y en tu infraestructura",
        ],
      },
      tls: {
        title: "Cifrado TLS/SSL en tránsito",
        secureTitle: "Comunicación segura:",
        intro: "Todo el tráfico entre Kochats y tu base de datos está cifrado con TLS (Transport Layer Security):",
        bullets: [
          "TLS 1.2 o superior garantiza transmisión cifrada",
          "Todas las credenciales transmitidas están cifradas",
          "Las respuestas y resultados de consultas viajan cifrados",
          "La validación de certificados previene ataques man-in-the-middle",
        ],
        modesTitle: "Opciones de modo SSL:",
        modes: [
          { label: "Require", desc: "Exige conexión SSL (recomendado)" },
          { label: "Prefer", desc: "Usa SSL si está disponible, de lo contrario sin cifrar" },
          { label: "Allow", desc: "Usa conexión sin cifrar si es posible" },
          { label: "Disable", desc: "Desactiva SSL explícitamente" },
        ],
      },
      best: {
        title: "Mejores prácticas de seguridad",
        bullets: [
          "Usa contraseñas robustas y únicas para usuarios de solo lectura",
          "Rota credenciales y actualiza contraseñas con regularidad",
          'Utiliza el modo SSL "Require" para máxima seguridad',
          "Restringe el acceso del usuario a las tablas y esquemas necesarios",
          "Monitorea los logs de acceso a la base de datos para detectar actividad sospechosa",
        ],
      },
    },
    en: {
      title: "Security & Data Protection",
      subtitle: "Learn how we protect your data and ensure secure connections",
      alert:
        "We take data security seriously. All database credentials are encrypted and your data is never replicated or stored on our servers.",
      readOnly: {
        title: "Read-Only Database Users",
        whyTitle: "Why Read-Only Access?",
        why: "When connecting a database, the credentials you provide must have read-only access permissions. This ensures that even if there's any unauthorized access, no data can be modified or deleted from your database.",
        howTitle: "How to Create a Read-Only User:",
        pgLabel: "-- For PostgreSQL:",
      },
      encryption: {
        title: "Credential Encryption",
        howTitle: "How Credentials Are Protected:",
        bullets: [
          "All database credentials (username, password, host details) are encrypted using industry-standard encryption algorithms",
          "Encryption keys are securely managed and never stored alongside encrypted data",
          "Encrypted credentials are stored in our secure database with additional access controls",
          "Credentials are only decrypted when establishing connections to your database",
        ],
      },
      remote: {
        title: "Remote Connections Only",
        noData: "No Data Replication:",
        intro: "We use a remote connection approach, which means:",
        bullets: [
          "Data is never copied or replicated to our servers",
          "Queries are executed directly against your database in real-time",
          "Results are temporarily processed and not permanently stored",
          "Your data remains entirely under your control and on your infrastructure",
        ],
      },
      tls: {
        title: "TLS/SSL Encryption in Transit",
        secureTitle: "Secure Communication:",
        intro: "All traffic between Kochats and your database is encrypted using TLS (Transport Layer Security):",
        bullets: [
          "TLS 1.2 or higher ensures encrypted data transmission",
          "All credentials transmitted to your database are encrypted",
          "Query results and responses are encrypted in transit",
          "Man-in-the-middle attacks are prevented through certificate validation",
        ],
        modesTitle: "SSL Mode Options:",
        modes: [
          { label: "Require", desc: "Enforces SSL connection (recommended)" },
          { label: "Prefer", desc: "Uses SSL if available, falls back to unencrypted" },
          { label: "Allow", desc: "Uses unencrypted connection if possible" },
          { label: "Disable", desc: "Explicitly disables SSL" },
        ],
      },
      best: {
        title: "Security Best Practices",
        bullets: [
          "Always use strong, unique passwords for read-only database users",
          "Regularly rotate credentials and update passwords",
          'Use SSL Mode "Require" for maximum security',
          "Restrict database user access to only necessary tables and schemas",
          "Monitor database access logs for suspicious activity",
        ],
      },
    },
  } as const

  const t = copy[language]
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6 max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            {/* Security Overview */}
            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground ml-2">
                {t.alert}
              </AlertDescription>
            </Alert>

            {/* Read-Only Database Users */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-secondary" />
                  {t.readOnly.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.readOnly.whyTitle}</h3>
                  <p className="text-muted-foreground">{t.readOnly.why}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.readOnly.howTitle}</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm font-mono text-muted-foreground">
                    <div>{t.readOnly.pgLabel}</div>
                    <div className="text-foreground">CREATE USER kochats_readonly WITH PASSWORD 'secure_password';</div>
                    <div className="text-foreground">GRANT CONNECT ON DATABASE your_database TO kochats_readonly;</div>
                    <div className="text-foreground">GRANT USAGE ON SCHEMA public TO kochats_readonly;</div>
                    <div className="text-foreground">
                      GRANT SELECT ON ALL TABLES IN SCHEMA public TO kochats_readonly;
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credential Encryption */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-secondary" />
                  {t.encryption.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.encryption.howTitle}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {t.encryption.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Remote Connections */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-secondary" />
                  {t.remote.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.remote.noData}</h3>
                  <p className="text-muted-foreground mb-4">{t.remote.intro}</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {t.remote.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* TLS/SSL Encryption */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  {t.tls.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.tls.secureTitle}</h3>
                  <p className="text-muted-foreground mb-4">{t.tls.intro}</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {t.tls.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.tls.modesTitle}</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-sm">
                    {t.tls.modes.map((mode) => (
                      <div key={mode.label} className="text-foreground">
                        <span className="font-semibold">{mode.label}:</span>{" "}
                        <span className="text-muted-foreground">{mode.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-5 h-5" />
                  {t.best.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <ul className="space-y-2">
                  {t.best.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
