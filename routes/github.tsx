import { Handlers, PageProps } from "$fresh/server.ts";
import { useState } from "preact/hooks";
import Layout from "@/components/layout.tsx";

interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  location: string;
  created_at: string;
}

export const handler: Handlers<User | null> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const username = url.searchParams.get("q");
    if (!username) {
      return ctx.render(null);
    }
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (res.status === 404) {
      return ctx.render(null);
    }

    const user: User = await res.json();
    return ctx.render(user);
  },
};

export default function github({ data }: PageProps<User | null>) {
  const [user, setUser] = useState(data);

  if (user === null || user.login === null) {
    return (
      <Layout>
        <h1 class="my-6">User not found!</h1>
      </Layout>
    );
  } else if (user && user.login) {
    return (
      <Layout>
        <section>
          <div class="container mx-auto px-6 py-8">
            <h2>Github Profile</h2>
            <div class="flex flex-wrap -mx-6">
              <div class="w-full md:w-1/2 px-6">
                <img src={user.avatar_url} width={64} height={64} />
              </div>
              <div class="w-full md:w-1/2 px-6">
                <h1>{user.name}</h1>
                <p>{user.login}</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
