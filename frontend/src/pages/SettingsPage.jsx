import React, { useEffect } from 'react'
import { THEMES } from '../constants'
import { Send } from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How are you doing today?", isSent: false },
  { id: 2, content: "Did you really like the theme you selected?", isSent: true },
]

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  // // Set a default theme if none is selected
  // useEffect(() => {
  //   if (!theme) {
  //     setTheme(THEMES[0]); // Set the default theme
  //   }
  // }, [theme, setTheme]);

  return (
    <div className='min-h-screen   container mx-auto px-4 pt-20 max-w-5xl'>
      <div className='space-y-6'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-semibold'>Theme</h2>
          <p className='text-sm text-base-content/70'>Choose a theme for your chat interface</p>
        </div>
        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2'>
          {THEMES.map((t) => (
            <button
              key={t}
              //aria-label={`Select ${t} theme`}
              className={`group flex flex-col items-center  gap-1 p-2 rounded-l transition-colors ${theme === t ? "bg-base-200  border-secondary" : "hover:bg-base-200/50"}`}
              onClick={() =>{
                //console.log(`Theme clicked: ${t}`); // Debug log
                setTheme(t)}}
            >
              <div className='relative h-8 w-full rounded-md overflow-hidden' data-theme={t}>
                <div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
                  <div className='rounded bg-primary'></div>
                  <div className='rounded bg-secondary'></div>
                  <div className='rounded bg-accent'></div>
                  <div className='rounded bg-neutral'></div>
                </div>
              </div>
              <span className='text-[11px] font-mono truncate w-full text-center'>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
        <h3 className='text-lg  font-semibold'>Preview</h3>
        <div className=' shadow-lg border border-base-300 bg-base-100 rounded-xl overflow-hidden'>
          <div className='p-4 bg-base-200'>
            <div className='max-w-lg mx-auto'>
              {/* mock chat ui */}
              <div className='bg-base-100 rounded-xl shadow-sm overflow-hidden '>
                {/* chat header */}
                <div className='border-b px-4 py-3 bg-base-100 border-base-300'>
                  <div className='flex items-center gap-3'>
                    <div className='border w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium'>
                      s
                    </div>
                    <div>
                      <h3 className='font-medium text-sm'>adam smith</h3>
                      <p className='text-xs text-base-content/70'>Online</p>
                    </div>
                  </div>
                </div>
                {/* chat messagtes */}
                <div className='p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100'>
                  {PREVIEW_MESSAGES.map((message)=>(
                    <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-xl p-3 shadow-sm 
                        ${message.isSent ? "bg-primary text-primary-content":"bg-base-200"}
                        `}>
                          <p className='text-sm'>{message.content}</p>
                          <p 
                          className={`text-[10px] mt-1.5
                            ${message.isSent ? "text-secondary-content/70":"text-base-content/70"}
                            `}
                          >
                           12:00 PM 
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* chat input */}
                <div className='p-4 border-t border-blue-300 bg-base-100'>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      className='input input-bordered flex-1  text-base-content h-10'
                      placeholder='Type a message...'
                      value="This is preview"
                      readOnly
                    />
                    <button className='btn btn-primary h-10 min-h-0'>
                      <Send size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
