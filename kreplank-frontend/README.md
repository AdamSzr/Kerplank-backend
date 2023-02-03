/custom/posts
  ? ids: number[]
  & slug: string
  & category: string
  & tag: string
  & pinned: bool
  => application/json 200 {
  }
  => application/json 404 {
  }
  eg: /posts?ids=123
  eg: /posts?ids=123,456,789
  eg: /posts?slug=abc
  eg: /posts?slug=marchewka-czerwona-albo-pomaranczowa
/custom/posts/:id(\d+)
  =>  /posts/1
  =>  /posts/123
/posts/:slug(\w+)
  =>  /posts/homepage
  =>  /posts/contact
  =>  /posts/about
  =>  /posts/szla-dzieweczka
  =>  /posts/adam-zjada-ciasteczka
---
/custom/pages
  ? view: 'homepage'|'about'|'contact'
/custom/pages/:id(\d+)
  =>  /pages/1
  =>  /pages/123
/custom/pages/:slug(\w+)
  =>  /pages/homepage
  =>  /pages/contact
  =>  /pages/about
  =>  /pages/szla-dzieweczka
  =>  /pages/adam-zjada-ciasteczka