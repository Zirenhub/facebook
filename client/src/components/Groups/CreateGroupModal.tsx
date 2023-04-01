import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { createGroup } from '../../api/messages';
import { getFriends } from '../../api/profile';
import { TProfileDefault } from '../../types/Profile';
import Loading from '../Loading';
import InviteFriendCard from './InviteFriendCard';

type TFormData = {
  groupName: string;
  invited: string[];
};

function CreateGroupModal({ close }: { close: () => void }) {
  const [formData, setFormData] = useState<TFormData>({
    groupName: '',
    invited: [],
  });
  const [formError, setFormError] = useState<string | null>(null);

  const { isLoading, isError, data, error } = useQuery<
    TProfileDefault[],
    Error
  >({
    queryKey: ['friends'],
    queryFn: getFriends,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (formData.groupName) {
      try {
        await createGroup(formData);
        close();
      } catch (err) {
        if (err instanceof Error) {
          setFormError(err.message);
        }
      }
    }
  }

  function handleInvite(friendID: string) {
    setFormData({
      ...formData,
      invited: [...formData.invited, friendID],
    });
  }

  function handleRemove(friendID: string) {
    const updatedInvites = formData.invited.filter((x) => x !== friendID);
    setFormData({ ...formData, invited: updatedInvites });
  }

  return (
    <form
      className="p-3 bg-gray-200 rounded-md m-4 flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="groupName">
        Group Name
      </label>
      <input
        name="groupName"
        placeholder="Group Name"
        type="text"
        maxLength={25}
        onChange={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLInputElement;
          setFormData({ ...formData, groupName: target.value });
        }}
        className="py-1 px-3 rounded-lg w-full font-bold border-2 border-gray-300"
      />
      <div className="flex gap-3 overflow-auto">
        {data?.map((f) => {
          return (
            <div key={f._id}>
              <InviteFriendCard
                friend={f}
                handleInvite={() => handleInvite(f._id)}
                handleRemove={() => handleRemove(f._id)}
                isInvited={formData.invited.includes(f._id)}
              />
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white rounded-full w-full py-1 font-bold"
      >
        Create Group
      </button>
      {formError && <p className="text-center">{formError}</p>}
    </form>
  );
}

export default CreateGroupModal;