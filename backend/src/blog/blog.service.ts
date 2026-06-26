import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SEED_RESOURCES } from './seed-resources';

export interface BlogInput {
  title: string;
  category?: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  published?: boolean;
}

@Injectable()
export class BlogService implements OnModuleInit {
  private readonly logger = new Logger(BlogService.name);
  constructor(private readonly prisma: PrismaService) {}

  /** Seed a few published resources (with cover images) on first boot. */
  async onModuleInit() {
    const count = await this.prisma.blogPost.count();
    if (count > 0) return;
    for (const r of SEED_RESOURCES) {
      await this.prisma.blogPost.create({
        data: {
          slug: this.slugify(r.title),
          title: r.title,
          category: r.category,
          excerpt: r.excerpt,
          body: r.body,
          coverImage: r.coverImage,
          published: true,
        },
      });
    }
    this.logger.log(`Seeded ${SEED_RESOURCES.length} resources`);
  }

  async publicList() {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        title: true,
        category: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
      },
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
        coverImage: input.coverImage,
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
        coverImage: input.coverImage,
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
