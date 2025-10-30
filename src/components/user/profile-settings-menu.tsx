import { ProfileSettingsTwo } from "@/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const ProfileSettingsMenu = () => {

  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  return (
    <section className='custom-scrollbar bg-background rounded-lg overflow-hidden'>
      <div className='flex flex-1 flex-col justify-start'>

        <div className="w-full text-base font-medium text-muted-foreground rounded-none">
          {ProfileSettingsTwo.map((link) => {
            const isActive = pathname.startsWith(link.route); // Use startsWith for partial matches
            return (
              <Link
                key={link.label}
                to={link.route}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  isActive ? "border-r-2 border-primary bg-muted" : "",
                  "flex justify-between border-b last:border-b-0 border-border items-center w-full px-4 py-3 text-muted-foreground cursor-pointer hover:bg-muted"
                )}
              >
                <div className="flex gap-2 items-center">
                  <link.icon size={20} color={isActive ? 'black' : 'gray'} /> {/* Render the Lucide icon */}
                  <span>{link.label}</span>
                </div>

                <ChevronRight size={20} />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ProfileSettingsMenu;
