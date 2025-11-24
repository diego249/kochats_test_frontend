"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAuthToken } from "@/lib/auth"
import { listDataSources, createDataSource, deleteDataSource, testDataSourceConnection } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Loader } from "lucide-react"

export default function DataSourcesPage() {
  const router = useRouter()
  const [dataSources, setDataSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<number | null>(null)
  const [testResult, setTestResult] = useState<{ id: number; success: boolean; message: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    engine: "postgres",
    host: "",
    port: 5432,
    database: "",
    user: "",
    password: "",
    sslmode: "prefer",
  })

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    loadDataSources()
  }, [router])

  const loadDataSources = async () => {
    try {
      const data = await listDataSources()
      setDataSources(data)
    } catch (error) {
      console.error("Error loading datasources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDataSource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const config = {
        host: formData.host,
        port: formData.port,
        database: formData.database,
        user: formData.user,
        password: formData.password,
        sslmode: formData.sslmode,
      }
      await createDataSource({
        name: formData.name,
        engine: formData.engine,
        config,
        is_active: true,
      })
      setDialogOpen(false)
      setFormData({
        name: "",
        engine: "postgres",
        host: "",
        port: 5432,
        database: "",
        user: "",
        password: "",
        sslmode: "prefer",
      })
      await loadDataSources()
    } catch (error: any) {
      console.error("Error creating datasource:", error)
      alert(error.message)
    }
  }

  const handleTestConnection = async (id: number) => {
    setTesting(id)
    try {
      const result = await testDataSourceConnection(id)
      setTestResult({ id, success: result.ok, message: result.ok ? "Connection successful" : "Connection failed" })
      setTimeout(() => setTestResult(null), 3000)
    } catch (error: any) {
      setTestResult({ id, success: false, message: error.message })
    } finally {
      setTesting(null)
    }
  }

  const handleDeleteDataSource = async (id: number) => {
    if (confirm("Are you sure you want to delete this data source?")) {
      try {
        await deleteDataSource(id)
        await loadDataSources()
      } catch (error) {
        console.error("Error deleting datasource:", error)
        alert("Failed to delete data source")
      }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Data Source
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Data Source</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateDataSource} className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., My Postgres"
                        required
                      />
                    </div>
                    <div>
                      <Label>Engine</Label>
                      <Select
                        value={formData.engine}
                        onValueChange={(value) => setFormData({ ...formData, engine: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgres">PostgreSQL</SelectItem>
                          <SelectItem value="bigquery">BigQuery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Host</Label>
                      <Input
                        value={formData.host}
                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                        placeholder="localhost"
                        required
                      />
                    </div>
                    <div>
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={formData.port}
                        onChange={(e) => setFormData({ ...formData, port: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Database</Label>
                      <Input
                        value={formData.database}
                        onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                        placeholder="mydb"
                        required
                      />
                    </div>
                    <div>
                      <Label>User</Label>
                      <Input
                        value={formData.user}
                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                        placeholder="username"
                        required
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>SSL Mode</Label>
                      <Select
                        value={formData.sslmode}
                        onValueChange={(value) => setFormData({ ...formData, sslmode: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disable">Disable</SelectItem>
                          <SelectItem value="allow">Allow</SelectItem>
                          <SelectItem value="prefer">Prefer</SelectItem>
                          <SelectItem value="require">Require</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Engine</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((ds) => (
                      <TableRow key={ds.id} className="border-border/50">
                        <TableCell className="font-medium">{ds.name}</TableCell>
                        <TableCell className="capitalize">{ds.engine}</TableCell>
                        <TableCell>{ds.config.host}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                            {ds.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestConnection(ds.id)}
                            disabled={testing === ds.id}
                          >
                            {testing === ds.id ? <Loader className="w-4 h-4 animate-spin" /> : "Test"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteDataSource(ds.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
