import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface BlogInput {
  title: string;
  category?: string;
  excerpt?: string;
  body: string;
  published?: boolean;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async publicList() {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true, category: true, excerpt: true, createdAt: true },
    });
  }

  async publicBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({ where: { slug, published: true } });
    if (!post) throw new NotFoundException('Article not found');
    return post;
  }

  // ── Admin ──
  adminList() {
    return this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async adminGet(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Article not found');
    return post;
  }

  async create(input: BlogInput) {
    const slug = await this.uniqueSlug(input.title);
    return this.prisma.blogPost.create({
      data: {
        slug,
        title: input.title,
        category: input.category,
        excerpt: input.excerpt,
        body: input.body,
        published: input.published ?? false,
      },
    });
  }

  async update(id: string, input: Partial<BlogInput>) {
    await this.adminGet(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        title: input.title,
        category: input.category,
        excerpt: input.excerpt,
        body: input.body,
        published: input.published,
      },
    });
  }

  async remove(id: string) {
    await this.adminGet(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { ok: true };
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  private async uniqueSlug(title: string): Promise<string> {
    const base = this.slugify(title) || 'article';
    let slug = base;
    let n = 2;
    while (await this.prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`;
    }
    return slug;
  }
}
