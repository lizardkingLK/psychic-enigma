import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../types/supabase';
import Avatar from './upload';
type Profiles = Database['public']['Tables']['profiles']['Row']

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<Profiles['id']>()
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [website, setWebsite] = useState<Profiles['website']>(null)
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id, username, website, avatar_url`)
        .eq('id', user.id)
        .maybeSingle()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setId(data.id)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: Profiles['username']
    website: Profiles['website']
    avatar_url: Profiles['avatar_url']
  }) {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div className='bg-green-500 flex justify-between items-center p-2'>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div className='bg-green-500 flex justify-between items-center p-2'>
        <label htmlFor="username">Username</label>
        <input
        className='bg-transparent'
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='bg-green-500 flex justify-between items-center p-2'>
        <label htmlFor="website">Website</label>
        <input
        className='bg-transparent'
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Avatar
      uid={id}
      url={avatar_url}
      size={150}
      onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ username, website, avatar_url: url })
      }}
    />

      <div className='bg-green-500 flex justify-between items-center p-2'>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div className='bg-green-500 flex justify-between items-center p-2'>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}