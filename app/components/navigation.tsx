import clsx from "clsx";
import { Fragment } from "react";
import { NavLink } from "react-router";

const navigationLinks = [
  {
    title: "Welcome",
    links: [
      {
        title: "About me",
        href: "/",
        icon: <div className="i-solar-user-hand-up-bold-duotone text-lg" />,
      },
      {
        title: "Writing",
        href: "/blog",
        icon: <div className="i-solar-text-field-focus-line-duotone text-lg" />,
        trailing: (
          <div className="bg-stone-300 dark:bg-neutral-700 flex items-center leading-none justify-center text-xs font-bold rounded-full size-6">
            30
          </div>
        ),
      },
      {
        title: "Twits",
        href: "/twits",
        icon: <div className="i-solar-fire-square-line-duotone text-lg" />,
      },
    ],
  },
  {
    title: "Projects",
    links: [
      {
        title: "Adeton",
        href: "/projects/adeton",
        icon: <div className="i-solar-sticker-circle-line-duotone text-lg" />,
      },
      {
        title: "USSDK",
        href: "/projects/ussdk",
        icon: <div className="i-solar-hashtag-square-line-duotone text-lg" />,
      },
      {
        title: "OTR",
        href: "/projects/otr",
        icon: <div className="i-solar-hand-shake-bold-duotone text-lg" />,
      },
    ],
  },
];

export function Navigation() {
  return (
    <div className="w-19rem">
      <div className="text-secondary">
        <div className="mt-6 h-16 rounded-full bg-secondary mx-6"></div>
        <p className="px-6 mt-4">
          Home to the super creative. Petty to design and aesthetics. Fascinated by animals.
          Philosophical and cares and about posterity.
        </p>

        <p className="mt-4 px-6">
          I was born to inspire and it's the reason I do anything. I have my shortcomings.
        </p>
      </div>

      {navigationLinks.map((navlink) => (
        <Fragment key={navlink.title}>
          <header className="mx-7 text-secondary mt-4 text-sm font-medium">{navlink.title}</header>
          <ul className="px-4" key={navlink.title}>
            {navlink.links.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    clsx(
                      "flex px-4 py-3 rounded-3xl gap-3 items-center hover:(bg-stone-200 dark:bg-neutral-800 opacity-100) transition duration-200",
                      {
                        "bg-stone-200 dark:bg-neutral-800": isActive,
                        "opacity-60": !isActive,
                      },
                    )
                  }
                >
                  <div className="size-6 flex items-center justify-center">{link.icon}</div>
                  <div className="flex-1">{link.title}</div>
                  <div>{link.trailing}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
