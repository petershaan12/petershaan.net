import { useState } from "react";  
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";  
import { Button } from "./ui/button";  
import { Menu } from "lucide-react";  
import { Link } from "@remix-run/react";  
import { useNavigate } from "@remix-run/react";  
import { Icons } from "./icons";  
import { siteConfig } from "~/config/site";  
  
export function MobileNav() {  
  const [open, setOpen] = useState(false);  
  const navigate = useNavigate();  
  
  return (  
    <Sheet open={open} onOpenChange={setOpen}>  
      <SheetTrigger asChild>  
        <Button variant="outline" className="w-10 px-0 sm:hidden">  
          <Menu className="h-5 w-5" />  
          <span className="sr-only">Toggle Theme</span>  
        </Button>  
      </SheetTrigger>  
      <SheetContent side="right">  
        <MobileLink  
          onOpenChange={setOpen}  
          to="/"  
          className="flex items-center"  
        >  
          <Icons.logo className="mr-2 h-4 w-4" />  
        </MobileLink>  
        <div className="flex flex-col gap-3 mt-8">  
          <MobileLink onOpenChange={setOpen} to="/blogs">  
            Blog  
          </MobileLink>  
          <MobileLink onOpenChange={setOpen} to="/projects">  
            Projects  
          </MobileLink>  
          <MobileLink onOpenChange={setOpen} to="/tools">  
            Tools  
          </MobileLink>  
        </div>  
      </SheetContent>  
    </Sheet>  
  );  
}  
  
interface MobileLinkProps {  
  children: React.ReactNode;  
  onOpenChange?: (open: boolean) => void;  
  to: string;  
  className?: string;  
}  
  
function MobileLink({  
  to,  
  onOpenChange,  
  children,  
  className,  
  ...props  
}: MobileLinkProps) {  
  const navigate = useNavigate();  
  
  return (  
    <Link  
      to={to}  
      onClick={() => {  
        navigate(to);  
        onOpenChange?.(false);  
      }}  
      className={className}  
      {...props}  
    >  
      {children}  
    </Link>  
  );  
}  
