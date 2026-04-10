import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Mail, MessageSquare, PlusCircle, UserPlus, Settings, LogOut, GitBranch } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <main className="container mx-auto px-4 py-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
            Beautiful Components for <span className="text-primary italic">The Box Solution</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            A showcase of the premium Shadcn UI components integrated into our packaging design system.
          </p>
        </section>

        {/* Button Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Buttons</h2>
            <p className="text-muted-foreground">Multiple variants and states for every use case.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Primary</p>
              <Button>Primary Button</Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Secondary</p>
              <Button variant="secondary">Secondary Button</Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Outline</p>
              <Button variant="outline">Outline Button</Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ghost</p>
              <Button variant="ghost">Ghost Button</Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Destructive</p>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Loading</p>
              <Button disabled>
                Please wait...
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">With Icon</p>
              <Button className="gap-2">
                <Mail className="size-4" /> Login with Email
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Icon Only</p>
              <Button variant="outline" size="icon">
                <GitBranch className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Dropdown Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Dropdown Menus</h2>
            <p className="text-muted-foreground">Accessible and customizable dropdown menus for complex actions.</p>
          </div>

          <div className="flex justify-center p-12 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 px-6 py-6 text-lg hover:bg-accent/50 transition-all">
                  Manage Account <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="center">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <UserPlus className="size-4" />
                    <span>Invite users</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2">
                    <PlusCircle className="size-4" />
                    <span>New Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <MessageSquare className="size-4" />
                    <span>Message Support</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-24 pb-12 text-center border-t">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 The Box Solution. Built with Shadcn UI and Next.js.
          </p>
        </footer>
      </main>
    </div>
  )
}
