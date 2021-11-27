import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export interface Post {
  slug: string;
  title: string;
  html?: string;
}

export interface NewPost {
  slug: string;
  title: string;
  markdown: string;
}

type MarkdownAttributes = {
  title: string;
};

function isValidPostAttributes(
  attributes: any
): attributes is MarkdownAttributes {
  return attributes?.title;
}

const postsPath = path.join(__dirname, "..", "..", "posts");

export async function getPosts(): Promise<Post[]> {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad metadata`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filename = path.join(postsPath, `${slug}.md`);
  const file = await fs.readFile(filename);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filename} is missing required attributes`
  );
  const html = marked(body);
  return {
    slug,
    html,
    title: attributes.title,
  };
}

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, `${post.slug}.md`), md);
  return getPost(post.slug);
}
