"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Textarea,
} from "@kronus-ui/ui";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Share } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Post Card — a social post with author, content, and engagement actions
 * ────────────────────────────────────────────────────────────────────────── */

export function PostCardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-4 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Mara Castillo" />
            <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
              MC
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-display text-sm font-semibold text-fg">
              Mara Castillo
            </span>
            <span className="truncate text-xs text-fg-tertiary">@maracastillo · 2h</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Post actions">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-fg-secondary">
            Shipped the new design system today and the team is already moving faster. Consistent
            tokens, accessible defaults, and components that just compose. This is the foundation
            we&apos;ve wanted for ages.
          </p>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-1.5 text-error" aria-label="Like post">
              <Heart className="size-4 fill-current" aria-hidden="true" />
              <span className="text-xs font-medium">248</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Comment on post">
              <MessageCircle className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">37</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Repost">
              <Repeat2 className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">12</span>
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Bookmark post">
                <Bookmark className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Share post">
                <Share className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const postCardCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@kronus-ui/ui";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Share } from "lucide-react";

export function PostCardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-4 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Mara Castillo" />
            <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
              MC
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-display text-sm font-semibold text-fg">
              Mara Castillo
            </span>
            <span className="truncate text-xs text-fg-tertiary">@maracastillo · 2h</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Post actions">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-fg-secondary">
            Shipped the new design system today and the team is already moving faster. Consistent
            tokens, accessible defaults, and components that just compose. This is the foundation
            we&apos;ve wanted for ages.
          </p>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-1.5 text-error" aria-label="Like post">
              <Heart className="size-4 fill-current" aria-hidden="true" />
              <span className="text-xs font-medium">248</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Comment on post">
              <MessageCircle className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">37</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Repost">
              <Repeat2 className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">12</span>
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Bookmark post">
                <Bookmark className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Share post">
                <Share className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Comment Thread — a threaded comment list with a composer and a nested reply
 * ────────────────────────────────────────────────────────────────────────── */

export function CommentThreadBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-5 shadow-lg">
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex items-start gap-3">
            <Avatar className="size-9">
              <AvatarImage src="https://i.pravatar.cc/80?img=5" alt="You" />
              <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                YO
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-2">
              <Textarea
                id="comment-composer"
                placeholder="Add a comment…"
                aria-label="Add a comment"
                rows={2}
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm">
                  Post
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Diego Lima" />
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  DL
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">Diego Lima</span>
                  <span className="text-xs text-fg-tertiary">1h</span>
                </div>
                <p className="text-sm leading-6 text-fg-secondary">
                  This is exactly what we needed. The token layer makes theming painless.
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like comment">
                    <Heart className="size-3.5" aria-hidden="true" />
                    <span className="text-xs font-medium">9</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label="Reply to Diego Lima"
                  >
                    Reply
                  </Button>
                </div>

                <div className="ml-11 mt-1 flex items-start gap-3 border-l border-border pl-4">
                  <Avatar className="size-8">
                    <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Mara Castillo" />
                    <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                      MC
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">Mara Castillo</span>
                      <span className="text-xs text-fg-tertiary">42m</span>
                    </div>
                    <p className="text-sm leading-6 text-fg-secondary">
                      Agreed — and it ships accessible by default, so we review less.
                    </p>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like reply">
                        <Heart className="size-3.5" aria-hidden="true" />
                        <span className="text-xs font-medium">4</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        aria-label="Reply to Mara Castillo"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Priya Raman" />
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  PR
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">Priya Raman</span>
                  <span className="text-xs text-fg-tertiary">28m</span>
                </div>
                <p className="text-sm leading-6 text-fg-secondary">
                  Bookmarking this for our next migration. Great work to the whole team.
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like comment">
                    <Heart className="size-3.5" aria-hidden="true" />
                    <span className="text-xs font-medium">6</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label="Reply to Priya Raman"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const commentThreadCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Separator,
  Textarea,
} from "@kronus-ui/ui";
import { Heart } from "lucide-react";

export function CommentThreadBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-5 shadow-lg">
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex items-start gap-3">
            <Avatar className="size-9">
              <AvatarImage src="https://i.pravatar.cc/80?img=5" alt="You" />
              <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                YO
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-2">
              <Textarea
                id="comment-composer"
                placeholder="Add a comment…"
                aria-label="Add a comment"
                rows={2}
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm">
                  Post
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Diego Lima" />
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  DL
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">Diego Lima</span>
                  <span className="text-xs text-fg-tertiary">1h</span>
                </div>
                <p className="text-sm leading-6 text-fg-secondary">
                  This is exactly what we needed. The token layer makes theming painless.
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like comment">
                    <Heart className="size-3.5" aria-hidden="true" />
                    <span className="text-xs font-medium">9</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label="Reply to Diego Lima"
                  >
                    Reply
                  </Button>
                </div>

                <div className="ml-11 mt-1 flex items-start gap-3 border-l border-border pl-4">
                  <Avatar className="size-8">
                    <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Mara Castillo" />
                    <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                      MC
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">Mara Castillo</span>
                      <span className="text-xs text-fg-tertiary">42m</span>
                    </div>
                    <p className="text-sm leading-6 text-fg-secondary">
                      Agreed — and it ships accessible by default, so we review less.
                    </p>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like reply">
                        <Heart className="size-3.5" aria-hidden="true" />
                        <span className="text-xs font-medium">4</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        aria-label="Reply to Mara Castillo"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Priya Raman" />
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  PR
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">Priya Raman</span>
                  <span className="text-xs text-fg-tertiary">28m</span>
                </div>
                <p className="text-sm leading-6 text-fg-secondary">
                  Bookmarking this for our next migration. Great work to the whole team.
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="gap-1.5" aria-label="Like comment">
                    <Heart className="size-3.5" aria-hidden="true" />
                    <span className="text-xs font-medium">6</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label="Reply to Priya Raman"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Profile Card — a user profile card with a cover, stats, and a follow action
 * ────────────────────────────────────────────────────────────────────────── */

const FOLLOWED_BY_AVATARS = [
  { src: "https://i.pravatar.cc/80?img=32", alt: "Diego Lima", fallback: "DL" },
  { src: "https://i.pravatar.cc/80?img=47", alt: "Priya Raman", fallback: "PR" },
  { src: "https://i.pravatar.cc/80?img=15", alt: "Sara Tavares", fallback: "ST" },
];

export function ProfileCardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-0 overflow-hidden p-0 shadow-lg">
        <div className="h-24 bg-gradient-primary" aria-hidden="true" />
        <CardContent className="flex flex-col gap-4 pb-6">
          <div className="flex items-start justify-between">
            <Avatar className="-mt-10 size-20 border-4 border-surface-raised">
              <AvatarImage src="https://i.pravatar.cc/160?img=12" alt="Mara Castillo" />
              <AvatarFallback className="bg-surface-overlay text-base text-fg-secondary">
                MC
              </AvatarFallback>
            </Avatar>
            <Button variant="primary" size="sm" className="mt-3">
              Follow
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-display text-lg font-semibold text-fg">Mara Castillo</span>
            <span className="text-sm text-fg-tertiary">@maracastillo</span>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">
              Design systems lead at Kronus. Building accessible, themeable interfaces.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">182</span>
              <span className="text-xs text-fg-tertiary">Posts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">12.4k</span>
              <span className="text-xs text-fg-tertiary">Followers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">340</span>
              <span className="text-xs text-fg-tertiary">Following</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AvatarGroup
              avatars={FOLLOWED_BY_AVATARS}
              size="sm"
              aria-label="Followed by Diego, Priya, and Sara"
            />
            <p className="text-xs text-fg-tertiary">Followed by Diego, Priya, and 18 others</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const profileCardCode = `import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Button,
  Card,
  CardContent,
} from "@kronus-ui/ui";

const FOLLOWED_BY_AVATARS = [
  { src: "https://i.pravatar.cc/80?img=32", alt: "Diego Lima", fallback: "DL" },
  { src: "https://i.pravatar.cc/80?img=47", alt: "Priya Raman", fallback: "PR" },
  { src: "https://i.pravatar.cc/80?img=15", alt: "Sara Tavares", fallback: "ST" },
];

export function ProfileCardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-0 overflow-hidden p-0 shadow-lg">
        <div className="h-24 bg-gradient-primary" aria-hidden="true" />
        <CardContent className="flex flex-col gap-4 pb-6">
          <div className="flex items-start justify-between">
            <Avatar className="-mt-10 size-20 border-4 border-surface-raised">
              <AvatarImage src="https://i.pravatar.cc/160?img=12" alt="Mara Castillo" />
              <AvatarFallback className="bg-surface-overlay text-base text-fg-secondary">
                MC
              </AvatarFallback>
            </Avatar>
            <Button variant="primary" size="sm" className="mt-3">
              Follow
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-display text-lg font-semibold text-fg">Mara Castillo</span>
            <span className="text-sm text-fg-tertiary">@maracastillo</span>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">
              Design systems lead at Kronus. Building accessible, themeable interfaces.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">182</span>
              <span className="text-xs text-fg-tertiary">Posts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">12.4k</span>
              <span className="text-xs text-fg-tertiary">Followers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-fg">340</span>
              <span className="text-xs text-fg-tertiary">Following</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AvatarGroup
              avatars={FOLLOWED_BY_AVATARS}
              size="sm"
              aria-label="Followed by Diego, Priya, and Sara"
            />
            <p className="text-xs text-fg-tertiary">Followed by Diego, Priya, and 18 others</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const socialBlocks: BlockContentMap = {
  "post-card": { preview: <PostCardBlock />, code: postCardCode },
  "comment-thread": { preview: <CommentThreadBlock />, code: commentThreadCode },
  "profile-card": { preview: <ProfileCardBlock />, code: profileCardCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function SocialGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(socialBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function SocialView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(socialBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
