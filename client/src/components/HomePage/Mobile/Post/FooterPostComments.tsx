import { useRef } from 'react';
import useComments from '../../../../hooks/useComments';
import { ModifiedPost } from '../../../../types/Post';
import CommentInput from './CommentInput';
import PostReactions from './PostReactions';
import SingleComment from './SingleComment';

type Props = {
  post: ModifiedPost;
  close: () => void;
};

function PostComments({ post, close }: Props) {
  const displayHeight = window.innerHeight;
  const heightRef = useRef<HTMLDivElement>(null);

  const { comments, mutateSendComment, isLoading, isError, error } =
    useComments(post._id);

  function handleMove(e: React.TouchEvent) {
    if (heightRef.current) {
      const currentHeight = displayHeight - e.touches[0].clientY;
      if (currentHeight > displayHeight || currentHeight < 0) return;
      if (currentHeight <= displayHeight - displayHeight * 0.8) {
        close();
      } else {
        heightRef.current.style.height = `${currentHeight}px`;
      }
    }
  }

  return (
    <div className="absolute h-screen w-full bg-transparent/80 z-40 top-0 left-0 flex flex-col justify-end">
      <div
        ref={heightRef}
        className="bg-white h-4/5 flex flex-col rounded-md p-3"
      >
        <div
          className="flex items-center relative"
          onTouchMoveCapture={handleMove}
        >
          <PostReactions reactionsDetail={post.reactionsDetails} />
          <div className="min-h-[5px] min-w-[35px] left-2/4 -translate-x-2/4  absolute rounded-lg bg-gray-300" />
        </div>
        <div className="flex flex-col grow">
          {isLoading && <p className="text-center">Loading...</p>}
          {isError && error && <p>{error.message}</p>}
          {comments.length ? (
            <div className="flex flex-col gap-3">
              {comments.map((c) => {
                return (
                  <div key={c._id} className="flex">
                    <SingleComment comment={c} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center">No comments yet.</p>
          )}
        </div>
        <CommentInput mutateSendComment={mutateSendComment} />
      </div>
    </div>
  );
}

export default PostComments;