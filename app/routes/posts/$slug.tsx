import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPost, Post } from "~/post";

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.slug, "Expected params.slug");
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  const html = post.html || "Something went wrong";
  return (
    <div>
      <h1>Some Post: {post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
