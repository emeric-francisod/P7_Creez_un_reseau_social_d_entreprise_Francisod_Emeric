import { jest } from '@jest/globals';
import db from '../../src/models/index.js';
import MockModel, * as mockModelMethods from '../mocks/mock-models.js';
import sequelizeInstance, * as sequelizeMethods from '../mocks/mock-sequelize.js';
import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    likePost,
    updatePost,
} from '../../src/services/posts.js';
import { NotFoundError } from '../../src/errors/index.js';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';

jest.spyOn(db, 'models', 'get').mockImplementation(
    () => new Proxy(
        { Model: MockModel },
        {
            get: (target) => target.Model,
        }
    )
);

db.ormInstance = sequelizeInstance;

beforeEach(() => {
    mockModelMethods.clearMocks();
    sequelizeMethods.clearSequelizeMocks();
});

describe('Post services test suite', () => {
    const postInfos = {
        postId: 13,
        title: 'Post title',
        message: 'Post message',
        imageUrl: 'image/pic.com',
        creationDate: '12-10-2022',
        lastUpdateDate: '26-11-2022',
        writerId: 6,
    };


    describe('Create user service test suite', () => {
        it('should create a user with the default role id and return the user', async () => {
            const newUser = await createPost({
                title: postInfos.title,
                message: postInfos.message,
                imageUrl: postInfos.imageUrl,
            });

            expect(newUser).toHaveProperty('title', postInfos.title);
            expect(newUser).toHaveProperty('message', postInfos.message);
            expect(newUser).toHaveProperty('imageUrl', postInfos.imageUrl);
        });
    });



    describe('Get all users service test suite', () => {
        const otherPost = {
            postId: 133,
            title: 'Post title 2',
            message: 'Post message',
            imageUrl: null,
            creationDate: '12-12-2022',
            lastUpdateDate: null,
            writerId: 8,
        };

        it('should get all posts\' informations', async () => {
            const returnedPostsInfos = [
                postInfos,
                otherPost,
            ];

            sequelizeMethods.mockQuery.mockResolvedValueOnce(returnedPostsInfos.map((value) => new MockModel(value)));
            const posts = await getAllPosts();

            expect(Array.isArray(posts)).toBe(true);
            expect(posts).toHaveLength(2);

            for (const index in posts) {
                expect(posts[index]).toHaveProperty('postId', returnedPostsInfos[index].postId);
                expect(posts[index]).toHaveProperty('title', returnedPostsInfos[index].title);
                expect(posts[index]).toHaveProperty('message', returnedPostsInfos[index].message);
                expect(posts[index]).toHaveProperty('imageUrl', returnedPostsInfos[index].imageUrl);
                expect(posts[index]).toHaveProperty('creationDate', returnedPostsInfos[index].creationDate);
                expect(posts[index]).toHaveProperty('lastUpdateDate', returnedPostsInfos[index].lastUpdateDate);
                expect(posts[index]).toHaveProperty('writerId', returnedPostsInfos[index].writerId);
            }

            expect(sequelizeMethods.mockQuery).toHaveBeenCalled();
        });

        it('should get all users\' informations if they match the userId', async () => {
            const returnedPostsInfos = [postInfos];

            sequelizeMethods.mockQuery.mockResolvedValueOnce(returnedPostsInfos.map((value) => new MockModel(value)));
            const posts = await getAllPosts({ userId: postInfos.writerId });

            expect(Array.isArray(posts)).toBe(true);
            expect(posts).toHaveLength(1);

            for (const index in posts) {
                expect(posts[index]).toHaveProperty('postId', returnedPostsInfos[index].postId);
                expect(posts[index]).toHaveProperty('title', returnedPostsInfos[index].title);
                expect(posts[index]).toHaveProperty('message', returnedPostsInfos[index].message);
                expect(posts[index]).toHaveProperty('imageUrl', returnedPostsInfos[index].imageUrl);
                expect(posts[index]).toHaveProperty('creationDate', returnedPostsInfos[index].creationDate);
                expect(posts[index]).toHaveProperty('lastUpdateDate', returnedPostsInfos[index].lastUpdateDate);
                expect(posts[index]).toHaveProperty('writerId', returnedPostsInfos[index].writerId);
            }

            expect(sequelizeMethods.mockQuery).toHaveBeenCalled();
        });

        it('should get all posts\' informations paginated', async () => {
            const returnedPostsInfos = [
                postInfos,
                otherPost,
            ];

            const limit = 1;
            const page = 2;

            sequelizeMethods.mockQuery.mockResolvedValueOnce([new MockModel(returnedPostsInfos[1])]);
            const posts = await getAllPosts({ limit, page });

            expect(Array.isArray(posts)).toBe(true);
            expect(posts).toHaveLength(1);

            expect(posts[0]).toHaveProperty('postId', returnedPostsInfos[1].postId);
            expect(posts[0]).toHaveProperty('title', returnedPostsInfos[1].title);
            expect(posts[0]).toHaveProperty('message', returnedPostsInfos[1].message);
            expect(posts[0]).toHaveProperty('imageUrl', returnedPostsInfos[1].imageUrl);
            expect(posts[0]).toHaveProperty('creationDate', returnedPostsInfos[1].creationDate);
            expect(posts[0]).toHaveProperty('lastUpdateDate', returnedPostsInfos[1].lastUpdateDate);
            expect(posts[0]).toHaveProperty('writerId', returnedPostsInfos[1].writerId);

            expect(sequelizeMethods.mockQuery).toHaveBeenCalled();

        });

        it('should get the post informations with more informations about the user', async () => {
            const returnedPostsInfos = [
                {
                    postId: postInfos.postId,
                    title: postInfos.title,
                    message: postInfos.message,
                    imageUrl: postInfos.imageUrl,
                    creationDate: postInfos.creationDate,
                    lastUpdateDate: postInfos.lastUpdateDate,
                    writer: {
                        writerId: postInfos.writerId,
                        roleId: 2,
                        email: 'john.doe@gmail.com',
                    },
                },
                {
                    postId: otherPost.postId,
                    title: otherPost.title,
                    message: otherPost.message,
                    imageUrl: otherPost.imageUrl,
                    creationDate: otherPost.creationDate,
                    lastUpdateDate: otherPost.lastUpdateDate,
                    writer: {
                        writerId: otherPost.writerId,
                        roleId: 1,
                        email: 'jane.doe@gmail.com',
                    },
                },
            ];

            sequelizeMethods.mockQuery.mockResolvedValueOnce(returnedPostsInfos.map((value) => new MockModel(value)));
            const posts = await getAllPosts({ userInfo: true });

            expect(Array.isArray(posts)).toBe(true);
            expect(posts).toHaveLength(2);

            for (const index in posts) {
                expect(posts[index]).toHaveProperty('postId', returnedPostsInfos[index].postId);
                expect(posts[index]).toHaveProperty('title', returnedPostsInfos[index].title);
                expect(posts[index]).toHaveProperty('message', returnedPostsInfos[index].message);
                expect(posts[index]).toHaveProperty('imageUrl', returnedPostsInfos[index].imageUrl);
                expect(posts[index]).toHaveProperty('creationDate', returnedPostsInfos[index].creationDate);
                expect(posts[index]).toHaveProperty('lastUpdateDate', returnedPostsInfos[index].lastUpdateDate);
                expect(posts[index]).not.toHaveProperty('writerId');
                expect(posts[index]).toHaveProperty('writer');
                expect(posts[index].writer).toHaveProperty('writerId', returnedPostsInfos[index].writer.writerId);
                expect(posts[index].writer).toHaveProperty('roleId', returnedPostsInfos[index].writer.roleId);
                expect(posts[index].writer).toHaveProperty('email', returnedPostsInfos[index].writer.email);
            }

            expect(sequelizeMethods.mockQuery).toHaveBeenCalled();
        });

        it('should get the post informations with more informations about the likes', async () => {
            const returnedPostsInfos = [
                {
                    postId: postInfos.postId,
                    title: postInfos.title,
                    message: postInfos.message,
                    imageUrl: postInfos.imageUrl,
                    creationDate: postInfos.creationDate,
                    lastUpdateDate: postInfos.lastUpdateDate,
                    writerId: postInfos.writerId,
                    likes: 2,
                    usersLiked: [52, 111],
                },
                {
                    postId: otherPost.postId,
                    title: otherPost.title,
                    message: otherPost.message,
                    imageUrl: otherPost.imageUrl,
                    creationDate: otherPost.creationDate,
                    lastUpdateDate: otherPost.lastUpdateDate,
                    writerId: otherPost.writerId,
                    likes: 1,
                    usersLiked: [52],
                },
            ];

            sequelizeMethods.mockQuery.mockResolvedValueOnce(returnedPostsInfos.map((value) => new MockModel(value)));
            const posts = await getAllPosts({ likeInfo: true });

            expect(Array.isArray(posts)).toBe(true);
            expect(posts).toHaveLength(2);

            for (const index in posts) {
                expect(posts[index]).toHaveProperty('postId', returnedPostsInfos[index].postId);
                expect(posts[index]).toHaveProperty('title', returnedPostsInfos[index].title);
                expect(posts[index]).toHaveProperty('message', returnedPostsInfos[index].message);
                expect(posts[index]).toHaveProperty('imageUrl', returnedPostsInfos[index].imageUrl);
                expect(posts[index]).toHaveProperty('creationDate', returnedPostsInfos[index].creationDate);
                expect(posts[index]).toHaveProperty('lastUpdateDate', returnedPostsInfos[index].lastUpdateDate);
                expect(posts[index]).toHaveProperty('writerId', returnedPostsInfos[index].writerId);
                expect(posts[index]).toHaveProperty('likes', returnedPostsInfos[index].likes);
                expect(posts[index]).toHaveProperty('usersLiked', returnedPostsInfos[index].usersLiked);
            }

            expect(sequelizeMethods.mockQuery).toHaveBeenCalled();
        });
    });



    describe('Get post service test suite', () => {
        it('should get the post informations', async () => {
            const returnedPostInfos = {
                ...postInfos,
            };
            mockModelMethods.mockFindByPk.mockResolvedValueOnce(new MockModel(returnedPostInfos));
            const post = await getPost(returnedPostInfos.userId);

            expect(post).toHaveProperty('postId', returnedPostInfos.postId);
            expect(post).toHaveProperty('title', returnedPostInfos.title);
            expect(post).toHaveProperty('message', returnedPostInfos.message);
            expect(post).toHaveProperty('imageUrl', returnedPostInfos.imageUrl);
            expect(post).toHaveProperty('creationDate', returnedPostInfos.creationDate);
            expect(post).toHaveProperty('lastUpdateDate', returnedPostInfos.lastUpdateDate);
            expect(post).toHaveProperty('writerId', returnedPostInfos.writerId);

            expect(mockModelMethods.mockFindByPk).toHaveBeenCalled();
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('attributes');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('postId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('title');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('message');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('imageUrl');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('creationDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('lastUpdateDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('writerId');
        });

        it('should get the post informations with more informations about the author', async () => {
            const returnedPostInfos = {
                postId: postInfos.postId,
                title: postInfos.title,
                message: postInfos.message,
                imageUrl: postInfos.imageUrl,
                creationDate: postInfos.creationDate,
                lastUpdateDate: postInfos.lastUpdateDate,
                writer: {
                    writerId: postInfos.writerId,
                    roleId: 2,
                    email: 'john.doe@gmail.com',
                },
            };
            mockModelMethods.mockFindByPk.mockResolvedValueOnce(new MockModel(returnedPostInfos));
            const post = await getPost(returnedPostInfos.email, { userInfo: true });

            expect(post).toHaveProperty('postId', returnedPostInfos.postId);
            expect(post).toHaveProperty('title', returnedPostInfos.title);
            expect(post).toHaveProperty('message', returnedPostInfos.message);
            expect(post).toHaveProperty('imageUrl', returnedPostInfos.imageUrl);
            expect(post).toHaveProperty('creationDate', returnedPostInfos.creationDate);
            expect(post).toHaveProperty('lastUpdateDate', returnedPostInfos.lastUpdateDate);
            expect(post).not.toHaveProperty('writerId');
            expect(post).toHaveProperty('writer');
            expect(post.writer).toHaveProperty('writerId', returnedPostInfos.writer.writerId);
            expect(post.writer).toHaveProperty('roleId', returnedPostInfos.writer.roleId);
            expect(post.writer).toHaveProperty('email', returnedPostInfos.writer.email);

            expect(mockModelMethods.mockFindByPk).toHaveBeenCalled();
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('attributes');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('postId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('title');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('message');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('imageUrl');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('creationDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('lastUpdateDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).not.toContain('writerId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('include');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include).toHaveProperty('association', 'writer');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include).toHaveProperty('attributes');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include.attributes).toContain('roleId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include.attributes).toContain('email');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include.attributes).toContainEqual(['user_id', 'writerId']);
        });

        it('should get the post informations with more informations about the like', async () => {
            const returnedPostInfos = {
                postId: postInfos.postId,
                title: postInfos.title,
                message: postInfos.message,
                imageUrl: postInfos.imageUrl,
                creationDate: postInfos.creationDate,
                lastUpdateDate: postInfos.lastUpdateDate,
                writerId: postInfos.writerId,
                likes: 2,
                usersLiked: [52, 111],
            };
            mockModelMethods.mockFindByPk.mockResolvedValueOnce(new MockModel(returnedPostInfos));
            const post = await getPost(returnedPostInfos.email, { likeInfo: true });

            expect(post).toHaveProperty('postId', returnedPostInfos.postId);
            expect(post).toHaveProperty('title', returnedPostInfos.title);
            expect(post).toHaveProperty('message', returnedPostInfos.message);
            expect(post).toHaveProperty('imageUrl', returnedPostInfos.imageUrl);
            expect(post).toHaveProperty('creationDate', returnedPostInfos.creationDate);
            expect(post).toHaveProperty('lastUpdateDate', returnedPostInfos.lastUpdateDate);
            expect(post).toHaveProperty('writerId', returnedPostInfos.writerId);
            expect(post).toHaveProperty('likes', returnedPostInfos.likes);
            expect(post).toHaveProperty('usersLiked', returnedPostInfos.usersLiked);

            expect(mockModelMethods.mockFindByPk).toHaveBeenCalled();
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('attributes');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('postId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('title');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('message');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('imageUrl');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('creationDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('lastUpdateDate');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].attributes).toContain('writerId');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('include');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1]).toHaveProperty('include');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include).toHaveProperty('association', 'users_liked');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include).toHaveProperty('attributes', []);
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include).toHaveProperty('through');
            expect(mockModelMethods.mockFindByPk.mock.calls[0][1].include.through).toHaveProperty('attributes', []);
        });

        it('should create throw a NotFoundError if the post doesn\'t exist', async () => {
            expect.assertions(1);
            mockModelMethods.mockFindByPk.mockResolvedValueOnce(null);
            await expect(getPost(113)).rejects.toBeInstanceOf(NotFoundError);
        });
    });



    describe('Update post service test suite', () => {
        it('should return the updated post', async () => {
            const post = new MockModel(postInfos);
            const newTitle = 'coucou';
            const updatedPost = await updatePost(post, { title: newTitle });

            expect(updatedPost.get()).toEqual(post.get());
            expect(updatedPost.get('title')).toBe(newTitle);
        });
    });



    describe('Like post service test suite', () => {
        const postId = 3;
        const userId = 6;

        it('should return 1 if the publication is liked', async () => {
            const like = await likePost(postId, userId, 1);
            expect(like).toBe(true);
        });

        it('should return 1 if the publication is disliked', async () => {
            mockModelMethods.mockStaticDestroy.mockResolvedValue([1]);
            const like = await likePost(postId, userId, 0);
            expect(like).toBe(true);
        });

        it('should return 0 if the publication is liked but was already liked', async () => {
            mockModelMethods.mockCreate.mockRejectedValueOnce(new UniqueConstraintError());
            const like = await likePost(postId, userId, 1);
            expect(like).toBe(false);
        });

        it('should return 0 if the publication is disliked but was already disliked', async () => {
            mockModelMethods.mockStaticDestroy.mockResolvedValue(0);
            mockModelMethods.mockFindByPk.mockResolvedValue(new MockModel(postInfos));
            const like = await likePost(postId, userId, 0);
            expect(like).toBe(false);
        });

        it('should throw a NotFoundError if we try to like a non existing post', async () => {
            mockModelMethods.mockCreate.mockRejectedValueOnce(new ForeignKeyConstraintError());
            await expect(likePost(postId, userId, 1)).rejects.toBeInstanceOf(NotFoundError);
        });

        it('should throw a NotFoundError if we try to dislike a non existing post', async () => {
            mockModelMethods.mockStaticDestroy.mockResolvedValue(0);
            mockModelMethods.mockFindByPk.mockResolvedValue(null);
            await expect(likePost(postId, userId, 0)).rejects.toBeInstanceOf(NotFoundError);
        });
    });



    describe('Delet post service test suite', () => {
        it('should return true if the operation succeeds', async () => {
            mockModelMethods.mockInstanceDestroy.mockResolvedValueOnce();
            expect(await deletePost(new MockModel(postInfos))).toBe(true);
        });
    });
});