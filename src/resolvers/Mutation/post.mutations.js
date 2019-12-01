import { getUserId } from '../../utils/getUserId';

export const createPost = (
  parent,
  { data: { title, body, published } },
  { prisma, request },
  info
) => {
  const userId = getUserId(request);
  const data = {
    title,
    body,
    published,
    author: { connect: { id: userId } }
  };
  return prisma.mutation.createPost({ data }, info);
};

export const updatePost = async (
  parent,
  { id, data },
  { prisma, request },
  info
) => {
  const userId = getUserId(request);

  const postExists = await prisma.exists.Post({
    id,
    author: { id: userId }
  });
  if (!postExists) {
    throw new Error('Post not found');
  }

  const isPublished = await prisma.exists.Post({
    id,
    published: true
  });

  if (
    isPublished &&
    typeof data.published !== 'undefined' &&
    !data.published
  ) {
    await prisma.mutation.deleteManyComments({
      where: { post: { id } }
    });
  }

  return prisma.mutation.updatePost({ data, where: { id } }, info);
};

export const deletePost = async (
  parent,
  { id },
  { prisma, request },
  info
) => {
  const userId = getUserId(request);
  const postExists = await prisma.exists.Post({
    id,
    author: { id: userId }
  });

  if (!postExists) {
    throw new Error('Post not found');
  }

  return prisma.mutation.deleteUser({ where: { id } }, info);
};
