"use client"

import { DotBackground } from "@/components/ui/dotbg"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ApiResponse } from "@/lib/api-schema"
import { useAuth } from "@/hooks/useAuth"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useNavigate } from "react-router-dom"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { Loader } from "./PageLoader"
import api from "@/lib/api"
import { toast } from "sonner"

type ActivityRecord = Record<string, unknown>

function isApiResponse(payload: unknown): payload is ApiResponse<unknown> {
  return (
    !!payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload &&
    "error" in payload
  )
}

function extractActivities(payload: unknown): ActivityRecord[] {
  if (Array.isArray(payload)) return payload as ActivityRecord[]
  if (isApiResponse(payload)) {
    const data = payload.data
    if (Array.isArray(data)) return data as ActivityRecord[]
    return []
  }
  return []
}

function formatHeader(key: string) {
  return key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2")
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return value.toLocaleString()
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function formatCellForKey(key: string, value: unknown) {
  if (key === "type" && typeof value === "string") {
    return value.replace(/_/g, " ")
  }

  if (key === "user" && value && typeof value === "object") {
    const u = value as Record<string, unknown>
    return (
      (typeof u.username === "string" && u.username) ||
      (typeof u.email === "string" && u.email) ||
      (typeof u.name === "string" && u.name) ||
      formatCell(value)
    )
  }

  // Common timestamp fields
  if (
    /(createdAt|updatedAt|timestamp|time|date)$/i.test(key) &&
    typeof value === "string"
  ) {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d.toLocaleString()
  }

  // Generic nested objects: prefer showing a username if present
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    if (typeof o.username === "string" && o.username) return o.username
  }

  return formatCell(value)
}

function ActivityContent() {
  const navigate = useNavigate()
  const { userType } = useAuth()
  const authHeader = useAuthHeader()
  const isAdmin = userType === "ADMIN"

  useEffect(() => {
    if (userType !== undefined && !isAdmin) {
      navigate("/dashboard", { replace: true })
      toast.error("You are not authorized to view this page")
    }
  }, [navigate, userType, isAdmin])

  const query = useQuery({
    queryKey: ["activity"],
    enabled: isAdmin && !!authHeader,
    queryFn: async () => {
      const response = await api.get("/api/activity")
      return extractActivities(response.data)
    },
    throwOnError: true,
  })

  const activities = query.data ?? []

  const columns = useMemo(() => {
    if (activities.length === 0) return []

    const seen = new Set<string>()
    const keys: string[] = []

    for (const k of Object.keys(activities[0] ?? {})) {
      if (!seen.has(k)) {
        seen.add(k)
        keys.push(k)
      }
    }
    for (const row of activities) {
      for (const k of Object.keys(row)) {
        if (!seen.has(k)) {
          seen.add(k)
          keys.push(k)
        }
      }
    }

    return keys
  }, [activities])

  if (!isAdmin) return null

  if (query.isPending) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Loader />
      </div>
    )
  }

  if (!query.isPending && activities.length === 0) {
    return (
      <DotBackground>
        <div className="container mx-auto py-10 min-h-screen">
          <h1 className="text-3xl font-bold mt-20 text-foreground">Activity</h1>
          <p className="mt-4 text-muted-foreground">No activity found.</p>
        </div>
      </DotBackground>
    )
  }

  return (
    <DotBackground>
      <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-20 text-foreground">Activity</h1>

        <div className="mt-6 border-2 rounded-xl bg-background overflow-hidden">
          <div className="w-full overflow-x-auto overflow-y-hidden">
            <Table className="min-w-max">
              <TableHeader className="font-heading">
                <TableRow className="bg-secondary-background text-foreground">
                  {columns.map((key) => (
                    <TableHead key={key} className="text-foreground whitespace-nowrap">
                      {formatHeader(key)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((row, idx) => (
                  <TableRow
                    key={(row as any)?.id ?? (row as any)?._id ?? idx}
                    className="text-foreground"
                  >
                    {columns.map((key) => (
                      <TableCell key={key} className="px-2 sm:px-4 py-2 max-w-[200px] sm:max-w-[360px] truncate overflow-hidden text-xs sm:text-sm">
                        {formatCellForKey(key, row[key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DotBackground>
  )
}

export default function ActivityPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ActivityContent />
    </ErrorBoundary>
  )
}

