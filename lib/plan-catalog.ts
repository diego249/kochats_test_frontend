export type PlanCatalogEntry = {
  code: string
  name: string
  price: string
  questions: string
  users: string
  datasources: string
}

export const planCatalog: PlanCatalogEntry[] = [
  { code: "free", name: "Free", price: "$0", questions: "50 lifetime", users: "1", datasources: "Demo" },
  { code: "starter", name: "Starter", price: "$9.99", questions: "1,000", users: "1", datasources: "1" },
  { code: "pro", name: "Pro", price: "$29.99", questions: "10,000", users: "4", datasources: "5" },
  { code: "business", name: "Business", price: "$89.99", questions: "50,000", users: "11", datasources: "15" },
  { code: "enterprise", name: "Enterprise", price: "Custom", questions: "Custom", users: "Custom", datasources: "Custom" },
]

export const planCatalogMap = planCatalog.reduce<Record<string, PlanCatalogEntry>>((acc, plan) => {
  acc[plan.code] = plan
  return acc
}, {})

export const defaultPlanCode = "free"
