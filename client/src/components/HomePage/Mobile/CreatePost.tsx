import { useEffect, useState } from 'react';
import useAuthContext from '../../../hooks/useAuthContext';
import Pfp from '../../../assets/pfp-two.svg';
import Back from '../../../assets/back.svg';
import Close from '../../../assets/x.svg';
import CreateDefaultPost from './CreatePostTypes/CreateDefaultPost';
import CreateImagePost from './CreatePostTypes/CreateImagePost';
import { TPost } from '../../../types/Post';
import { postDefault, postImage } from '../../../api/post';

function CreatePost({ close }: { close: () => void }) {
  const [postType, setPostType] = useState<'default' | 'image'>('default');
  const [post, setPost] = useState<TPost>({
    content: '',
    background: null,
    image: null,
    audience: 'friends',
  });
  const [canSendPost, setCanSendPost] = useState<boolean>(false);

  const auth = useAuthContext();

  async function handleSubmit() {
    const { content, image, background, audience } = post;
    try {
      if (postType === 'image' && image) {
        await postImage(content, image, audience);
      } else {
        await postDefault(content, background, audience);
      }
      close();
    } catch (err) {
      // handle errors!
      console.log(err);
    }
  }

  function handlePostAudience(e: React.SyntheticEvent) {
    const target = e.target as HTMLSelectElement;
    setPost({ ...post, audience: target.value });
  }

  useEffect(() => {
    const { image } = post;
    const content = post.content.trim();

    if (postType === 'image') {
      if (content && image) {
        setCanSendPost(true);
        return;
      }
      setCanSendPost(false);
      return;
    }
    if (content) {
      setCanSendPost(true);
    } else {
      setCanSendPost(false);
    }
  }, [post, postType]);

  return (
    <div className="z-10 absolute bg-white top-0 left-0 h-full w-full">
      <header className="flex justify-between p-3 border-b-2">
        <div className="flex gap-2 items-center">
          {postType === 'image' ? (
            <button type="button" onClick={() => setPostType('default')}>
              <Back />
            </button>
          ) : (
            <button type="button" onClick={close}>
              <Close />
            </button>
          )}
          <p className="font-bold">Create post</p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className={`${
              canSendPost
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            } font-bold rounded-sm px-2 py-1`}
          >
            POST
          </button>
        </div>
      </header>
      <div className="flex gap-2 p-2">
        <div className="h-12 w-12">
          <Pfp height="100%" width="100%" />
        </div>
        <div className="flex flex-col">
          <p>{auth.user?.fullName}</p>
          <select
            value={post.audience}
            onChange={handlePostAudience}
            className="bg-white font-bold"
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col p-2">
        {postType === 'default' && (
          <>
            <CreateDefaultPost post={post} setPost={setPost} />
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPostType('image');
                  setCanSendPost(false);
                }}
                className="bg-gray-200 rounded-md px-2 py-1"
              >
                Add image
              </button>
            </div>
          </>
        )}
        {postType === 'image' && (
          <CreateImagePost post={post} setPost={setPost} />
        )}
      </div>
    </div>
  );
}

export default CreatePost;
