import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/account'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96">
        {!session ? (
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
        ) : (
          <Account session={session} />
        )}
      </div>
  )
}

export default Home