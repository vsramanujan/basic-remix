import { useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import { createPost, getPost, Post } from "~/post";

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.slug, "Expected params.slug to be present");
  const slug: string = params.slug;

  return getPost(slug);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = form.get("title");
  const slug = form.get("slug");
  const markdown = form.get("markdown");

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function EditNote() {
  const { slug, title, html } = useLoaderData<Post>();
  const transition = useTransition();

  return (
    <div>
      <h3>Edit Note</h3>
      <Form method="post">
        <p>
          <label>
            Title{" "}
            <input type="text" name="title" defaultValue={title} key={title} />
          </label>
        </p>
        <p>
          <label>
            Slug{" "}
            <input type="text" name="slug" defaultValue={slug} key={slug} />
          </label>
        </p>
        <p>
          <label>
            Markdown
            <br />
            <textarea
              name="markdown"
              rows={20}
              defaultValue={html}
              key={html}
            />
          </label>
        </p>
        <p>
          <button type="submit">
            {transition.submission ? "Saving edit" : "Save"}
          </button>
        </p>
      </Form>
    </div>
  );
}
