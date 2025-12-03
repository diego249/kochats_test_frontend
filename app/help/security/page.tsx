"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Network, Database, AlertCircle } from "lucide-react"

export default function SecurityHelpPage() {
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
                Security & Data Protection
              </h1>
              <p className="text-muted-foreground mt-2">Learn how we protect your data and ensure secure connections</p>
            </div>

            {/* Security Overview */}
            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground ml-2">
                We take data security seriously. All database credentials are encrypted and your data is never
                replicated or stored on our servers.
              </AlertDescription>
            </Alert>

            {/* Read-Only Database Users */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-secondary" />
                  Read-Only Database Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Why Read-Only Access?</h3>
                  <p className="text-muted-foreground">
                    When connecting a database, the user credentials you provide must have read-only access permissions.
                    This ensures that even if there's any unauthorized access, no data can be modified or deleted from
                    your database.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How to Create a Read-Only User:</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm font-mono text-muted-foreground">
                    <div>-- For PostgreSQL:</div>
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
                  Credential Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How Credentials Are Protected:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        All database credentials (username, password, host details) are encrypted using
                        industry-standard encryption algorithms
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Encryption keys are securely managed and never stored alongside encrypted data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Encrypted credentials are stored in our secure database with additional access controls
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Credentials are only decrypted when establishing connections to your database</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Remote Connections */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-secondary" />
                  Remote Connections Only
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Data Replication:</h3>
                  <p className="text-muted-foreground mb-4">We use a remote connection approach, which means:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Data is never copied or replicated to our servers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Queries are executed directly against your database in real-time</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Results are temporarily processed and not permanently stored</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Your data remains entirely under your control and on your infrastructure</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* TLS/SSL Encryption */}
            <Card className="bg-card/40 border-border/40 transition-all duration-200 hover:border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  TLS/SSL Encryption in Transit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Secure Communication:</h3>
                  <p className="text-muted-foreground mb-4">
                    All traffic between Kochats and your database is encrypted using TLS (Transport Layer Security):
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>TLS 1.2 or higher ensures encrypted data transmission</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>All credentials transmitted to your database are encrypted</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Query results and responses are encrypted in transit</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Man-in-the-middle attacks are prevented through certificate validation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">SSL Mode Options:</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-sm">
                    <div className="text-foreground">
                      <span className="font-semibold">Require:</span>{" "}
                      <span className="text-muted-foreground">Enforces SSL connection (recommended)</span>
                    </div>
                    <div className="text-foreground">
                      <span className="font-semibold">Prefer:</span>{" "}
                      <span className="text-muted-foreground">Uses SSL if available, falls back to unencrypted</span>
                    </div>
                    <div className="text-foreground">
                      <span className="font-semibold">Allow:</span>{" "}
                      <span className="text-muted-foreground">Uses unencrypted connection if possible</span>
                    </div>
                    <div className="text-foreground">
                      <span className="font-semibold">Disable:</span>{" "}
                      <span className="text-muted-foreground">Explicitly disables SSL</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-5 h-5" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Always use strong, unique passwords for read-only database users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Regularly rotate credentials and update passwords</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Use SSL Mode "Require" for maximum security</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Restrict database user access to only necessary tables and schemas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Monitor database access logs for suspicious activity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
