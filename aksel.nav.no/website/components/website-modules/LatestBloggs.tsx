import { SanityBlockContent } from "@/sanity-block";
import { urlFor } from "@/sanity/interface";
import { AkselBloggDocT, ResolveContributorsT, ResolveSlugT } from "@/types";
import { dateStr } from "@/utils";
import { BodyLong, BodyShort, Heading, Link } from "@navikt/ds-react";
import { getImage } from "components/website-modules/utils/get-image";
import Image from "next/legacy/image";
import NextLink from "next/link";

export const getAuthors = (
  blog: ResolveContributorsT<ResolveSlugT<AkselBloggDocT>>
) => (blog?.contributors as any)?.map((x) => x?.title) ?? [];

export const LatestBloggposts = ({
  bloggs,
  title,
  level = "1",
  intro,
}: {
  bloggs: ResolveContributorsT<ResolveSlugT<AkselBloggDocT>>[];
  title: string;
  level?: "1" | "2";
  intro?: any[];
}) => {
  if (!bloggs || bloggs.length < 3) {
    return null;
  }

  return (
    <div className="mt-20">
      <Heading
        level={level}
        size="xlarge"
        className="text-deepblue-700 mx-auto w-full text-5xl md:mx-0 md:max-w-none"
      >
        {title}
      </Heading>
      {intro && (
        <SanityBlockContent
          blocks={intro}
          isIngress
          noLastMargin
          className="mt-4"
        />
      )}
      {/* Desktop-view */}
      <div className="my-12 hidden grid-cols-2 gap-12 md:grid">
        <div className="col-span-1">
          <div className="relative mb-10 block aspect-video">
            {bloggs[0]?.seo?.image ? (
              <Image
                src={urlFor(bloggs[0].seo.image)
                  .quality(100)
                  .auto("format")
                  .url()}
                quality={100}
                layout="fill"
                objectFit="cover"
                aria-hidden
                priority
                className="rounded-lg"
                decoding="sync"
              />
            ) : (
              <Image
                src={getImage(bloggs[0]?.heading ?? "", "thumbnail")}
                layout="fill"
                objectFit="contain"
                aria-hidden
                priority
                className="rounded-lg"
                decoding="sync"
              />
            )}
          </div>
          <NextLink href={`/${bloggs[0].slug}`} passHref legacyBehavior>
            <Link className="text-deepblue-500 no-underline hover:underline">
              <Heading
                size="large"
                level={(Number(level) + 1).toString() as any}
              >
                {bloggs[0].heading}
              </Heading>
            </Link>
          </NextLink>
          <BodyLong className="mt-4" size="small">
            {bloggs[0]?.ingress}
          </BodyLong>
          {getAuthors(bloggs[0]).length > 0 && (
            <BodyShort
              size="small"
              className="text-text-subtle mt-4 flex gap-2"
            >
              <span className="font-semibold">{getAuthors(bloggs[0])[0]}</span>
              <span>
                {dateStr(bloggs[0]?.publishedAt ?? bloggs[0]._createdAt)}
              </span>
            </BodyShort>
          )}
        </div>
        <div className="col-span-1 grid place-content-start gap-12">
          {bloggs.slice(1, 3).map((blog) => (
            <div key={blog._id} className="flex gap-6">
              <div className="relative hidden aspect-square h-[11.75rem] lg:block">
                {blog?.seo?.image ? (
                  <Image
                    src={urlFor(blog.seo.image).auto("format").url()}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                    className="rounded-lg"
                  />
                ) : (
                  <Image
                    src={getImage(blog?.heading ?? "", "thumbnail")}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                    className="rounded-lg"
                  />
                )}
              </div>

              <div>
                <NextLink href={`/${blog.slug}`} passHref legacyBehavior>
                  <Link className="text-deepblue-500 no-underline hover:underline">
                    <Heading
                      size="small"
                      level={(Number(level) + 1).toString() as any}
                    >
                      {blog.heading}
                    </Heading>
                  </Link>
                </NextLink>
                <BodyLong className="mt-4" size="small">
                  {blog?.ingress}
                </BodyLong>
                {getAuthors(blog).length > 0 ? (
                  <BodyShort
                    size="small"
                    className="text-text-subtle mt-4 flex gap-2"
                  >
                    <span className="font-semibold">{getAuthors(blog)[0]}</span>
                    <span>{dateStr(blog?.publishedAt ?? blog._createdAt)}</span>
                  </BodyShort>
                ) : (
                  <BodyShort size="small" className="text-text-subtle mt-4">
                    <span>{dateStr(blog?.publishedAt ?? blog._createdAt)}</span>
                  </BodyShort>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view */}
      <div className="my-10 mx-auto grid gap-12 md:hidden">
        <div className="w-full">
          <div className="relative mb-10 block aspect-video">
            {bloggs[0]?.seo?.image ? (
              <Image
                src={urlFor(bloggs[0].seo.image)
                  .quality(100)
                  .auto("format")
                  .url()}
                quality={100}
                layout="fill"
                objectFit="cover"
                aria-hidden
                priority
                className="rounded-lg"
              />
            ) : (
              <Image
                src={getImage(bloggs[0]?.heading ?? "", "thumbnail")}
                layout="fill"
                objectFit="contain"
                aria-hidden
                priority
                className="rounded-lg"
              />
            )}
          </div>
          <NextLink href={`/${bloggs[0].slug}`} passHref legacyBehavior>
            <Link className="text-deepblue-500 no-underline hover:underline">
              <Heading
                size="large"
                level={(Number(level) + 1).toString() as any}
              >
                {bloggs[0].heading}
              </Heading>
            </Link>
          </NextLink>
          <BodyLong className="mt-4" size="small">
            {bloggs[0]?.ingress}
          </BodyLong>
          {getAuthors(bloggs[0]).length > 0 && (
            <BodyShort
              size="small"
              className="text-text-subtle mt-4 flex gap-2"
            >
              <span className="font-semibold">{getAuthors(bloggs[0])[0]}</span>
              <span>
                {dateStr(bloggs[0]?.publishedAt ?? bloggs[0]._createdAt)}
              </span>
            </BodyShort>
          )}
        </div>
        <div className="grid w-full gap-12">
          {bloggs.slice(1, 3).map((blog) => (
            <div key={blog._id}>
              <div className="relative mb-6 block aspect-video">
                {blog?.seo?.image ? (
                  <Image
                    src={urlFor(blog.seo.image).auto("format").url()}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                    className="rounded-lg"
                  />
                ) : (
                  <Image
                    src={getImage(blog?.heading ?? "", "thumbnail")}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                    className="rounded-lg"
                  />
                )}
              </div>
              <div>
                <NextLink href={`/${blog.slug}`} passHref legacyBehavior>
                  <Link className="text-deepblue-500 no-underline hover:underline">
                    <Heading
                      size="small"
                      level={(Number(level) + 1).toString() as any}
                    >
                      {blog.heading}
                    </Heading>
                  </Link>
                </NextLink>
                <BodyLong className="mt-4" size="small">
                  {blog?.ingress}
                </BodyLong>
                {getAuthors(blog).length > 0 ? (
                  <BodyShort
                    size="small"
                    className="text-text-subtle mt-4 flex gap-2"
                  >
                    <span className="font-semibold">{getAuthors(blog)[0]}</span>
                    <span>{dateStr(blog?.publishedAt ?? blog._createdAt)}</span>
                  </BodyShort>
                ) : (
                  <BodyShort size="small" className="text-text-subtle mt-4">
                    <span>{dateStr(blog?.publishedAt ?? blog._createdAt)}</span>
                  </BodyShort>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
