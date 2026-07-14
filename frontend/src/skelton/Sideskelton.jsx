import React from 'react'

function Sideskelton() {
  return (
<div >
{Array(8).fill(0).map((_, index) => (
    <div key={index} className="flex flex-col gap-4 mt-4 ml-2">
  <div className="flex items-center gap-4">
    <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
    <div className="relative mx-auto lg:mx-0 size-12 object-cover rounded-full flex flex-col gap-3">
      <div className=" hidden lg:block text-left min-w-0 skeleton h-4 w-20"></div>
      <div className="hidden lg:block text-left min-w-0 skeleton h-4 w-28"></div>
    </div>
  </div>
</div>

  ))}
  </div>
  )
}

export default Sideskelton