// Redirect /admin/posts/new → editor with id="new"
import PostEditorPage from '../[id]/page'

export default function NewPostPage() {
  return <PostEditorPage params={Promise.resolve({ id: 'new' })} />
}
