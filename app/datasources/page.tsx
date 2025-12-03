"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAuthToken, getAuthUser } from "@/lib/auth"
import { listDataSources, createDataSource, deleteDataSource, testDataSourceConnection } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Loader, Database, Check, X, Info } from "lucide-react"

export default function DataSourcesPage() {
  const router = useRouter()
  const [dataSources, setDataSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<number | null>(null)
  const [testResult, setTestResult] = useState<{ id: number; success: boolean; message: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; dsId: number | null; dsName: string }>({
    isOpen: false,
    dsId: null,
    dsName: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)
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
  const [authUser, setAuthUserState] = useState<any>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    const user = getAuthUser()
    setAuthUserState(user)
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

  const handleDeleteDataSource = async () => {
    if (!deleteModal.dsId) return
    setIsDeleting(true)
    try {
      await deleteDataSource(deleteModal.dsId)
      setDataSources(dataSources.filter((ds) => ds.id !== deleteModal.dsId))
      setDeleteModal({ isOpen: false, dsId: null, dsName: "" })
    } catch (error) {
      console.error("Error deleting datasource:", error)
      alert("Failed to delete data source")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your database connections</p>
              </div>
              {authUser?.isOrgOwner && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      New Data Source
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <DialogTitle>Create Data Source</DialogTitle>
                        <Link href="/help/security" target="_blank">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground"
                          >
                            <Info className="w-4 h-4" />
                            <span className="text-xs">Security Info</span>
                          </Button>
                        </Link>
                      </div>
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
              )}
            </div>

            {/* Alert */}
            {testResult && (
              <Alert
                variant={testResult.success ? "default" : "destructive"}
                className="transition-all duration-200 border-border/50"
              >
                <AlertDescription className="flex items-center gap-2">
                  {testResult.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Data Sources Card */}
            <Card className="bg-card/40 border-border/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-secondary" />
                    Connected Sources
                  </CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                    {dataSources.length} sources
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead>Name</TableHead>
                      <TableHead>Engine</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((ds, idx) => (
                      <TableRow
                        key={ds.id}
                        className="border-border/30 hover:bg-secondary/5 transition-colors duration-200"
                        style={{
                          animation: `slideIn 0.3s ease-out ${idx * 50}ms forwards`,
                          opacity: 0,
                        }}
                      >
                        <style>{`
                          @keyframes slideIn {
                            from { opacity: 0; transform: translateX(-8px); }
                            to { opacity: 1; transform: translateX(0); }
                          }
                        `}</style>
                        <TableCell className="font-medium text-foreground">{ds.name}</TableCell>
                        <TableCell className="capitalize text-muted-foreground">{ds.engine}</TableCell>
                        <TableCell className="text-muted-foreground">{ds.config.host}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                              ds.is_active ? "bg-green-500/10 text-green-600" : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${ds.is_active ? "bg-green-600" : "bg-muted-foreground"}`}
                            />
                            {ds.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestConnection(ds.id)}
                            disabled={testing === ds.id}
                            className="transition-all duration-200 hover:border-secondary/50"
                          >
                            {testing === ds.id ? <Loader className="w-4 h-4 animate-spin" /> : "Test"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: true, dsId: ds.id, dsName: ds.name })}
                            className="transition-all duration-200 hover:border-destructive/50 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {dataSources.length === 0 && !loading && (
                  <div className="p-8 text-center">
                    <Database className="w-12 h-12 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">No data sources yet. Create one to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Data Source"
        description="Are you sure you want to delete this data source? Any bots using this source may stop working."
        itemName={deleteModal.dsName}
        onConfirm={handleDeleteDataSource}
        onCancel={() => setDeleteModal({ isOpen: false, dsId: null, dsName: "" })}
        isLoading={isDeleting}
      />
    </div>
  )
}
