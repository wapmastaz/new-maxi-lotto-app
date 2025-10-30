import Ball from '@/components/ball';
import { EmptyState } from '@/components/empty-state';
import { FavouriteBallDialog } from '@/components/favourite-ball-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useFetchFavouriteBalls, useUserProfile } from '@/hooks/useUserProfile';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/favourite-balls')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(false);

  const { data: favouriteBalls, isFetching } = useFetchFavouriteBalls();

  const { data: user } = useUserProfile();

  return (
    <>
      <section className="py-14 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Favourite Balls</h3>
      </section>
      {/* === change password form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">

          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center w-full">

              {isFetching && <Spinner />}

              {favouriteBalls && favouriteBalls.length > 0 ? (
                <div
                  className="bg-white rounded-2xl shadow w-full max-w-xs py-6 px-4 flex flex-wrap gap-2">
                  {favouriteBalls.map((num: number) => (
                    <Ball
                      key={num}
                      value={num}
                      isSelected
                      className="bg-[#FFF100] rounded-full h-10 w-10 text-[#0A4B7F]"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState title="No Favourite Balls" description="You have not added any favourite balls yet." />
              )}
            </div>
          </div>

          {/* add favourite balls */}
          <div className="flex justify-center items-center mt-8">
            <Button variant={"primary"} className="px-6 w-full uppercase bg-primary-900 text-white flex items-center gap-2 rounded" onClick={() => setOpen(true)}>Add Favourite Balls</Button>
          </div>

          {favouriteBalls && <FavouriteBallDialog open={open} user={user} favouriteBalls={favouriteBalls} setOpen={setOpen} />}
        </div>
      </section>
    </>
  )
}
