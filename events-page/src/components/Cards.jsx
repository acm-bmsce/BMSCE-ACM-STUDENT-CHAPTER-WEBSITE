import React from 'react'
import poster1 from './poster1.jpeg'

// imgSrc = "../../public/assetsCopy/poster1.jpeg" 

const Cards = () => {
  return (
    <div className='w-full'>
      <div class="w-500px overflow-hidden bg-[#03010f] rounded-lg shadow-md ">
    <img class="object-cover w-full h-64" src={poster1} alt="Article"/>

    <div class="p-6">
        <div>
            <span class="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">date</span>
            <a href="#" class="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline" tabindex="0" role="link">Fun with Algorithms</a>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Molestie parturient et sem ipsum volutpat vel. Natoque sem et aliquam mauris egestas quam volutpat viverra. In pretium nec senectus erat. Et malesuada lobortis.</p>
        </div>

        <div class="mt-4">
            <div class="flex items-center">
                <span class="mx-1 text-xs text-gray-600 dark:text-gray-300">21 SEP 2015</span>
            </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default Cards
