import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useUser } from "@/context/UserProvider";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { setUser } = useUser()!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (!name.trim()) return;

    const userData = {
      userId: uuid(),
      userName: name.trim(),
    };
    setUser(userData);
    navigate("/");
  };

  return (
    <div
      className={cn("flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10", className)}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardContent>
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your name to get started
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-foreground"
                />
              </div>

              <Button type="submit" className="w-full">
                Start Chat
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
