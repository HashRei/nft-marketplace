import Image from "next/image";
import Link from "next/link";
import { Wallet } from "../../blockchain/Wallet";
import * as React from "react";
import Divider from "@mui/material/Divider";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { DarkModeButton } from "../utils/DarkModeButton";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import CollectionsIcon from "@mui/icons-material/Collections";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface NavbarButtonProps {
  text?: string;
  path: string;
}

interface NavbarSocialButtonProps {
  text: string;
  path: string;
  icon?: any;
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* DESKTOP NAVBAR */}

      <div className=" hidden desktop:flex flex-col w-full items-center space-y-3 desktop:flex-row justify-between">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="flex p-2 space-x-3"
        >
          <Image
            src="/Logo_LooksSea.png"
            alt="LooksSea logo"
            width={"40px"}
            height={"40px"}
            quality={100}
          />
          <Link href="/" passHref>
            <p className="font-bold text-4xl cursor-pointer">LooksSea</p>
          </Link>
        </motion.div>
        <div className=" space-x-6">
          <NavbarSocialButton
            text="GitHub"
            path="https://github.com/HashRei/nft-marketplace"
            icon={<GitHubIcon className="mr-4" />}
          />

          <NavbarSocialButton
            text="Twitter"
            path="https://twitter.com/HashRei_"
            icon={<TwitterIcon className="mr-4" />}
          />
        </div>

        <NavbarButton text="Create an NFT" path="/MinterPage" />
        <NavbarButton text="Marketplace" path="/MarketplacePage" />
        <NavbarButton text="My collection" path="/MyCollectionPage" />

        <DarkModeButton />

        <Wallet isMobile={false} />
      </div>

      {/* MOBILE NAVBAR */}

      <div className=" flex flex-col w-full  justify-between desktop:hidden ">
        <div className="inline-flex tablet:flex justify-around w-full">
          <div className="flex p-2 space-x-3">
            <Image
              src="/Logo_LooksSea.png"
              alt="LooksSea logo"
              width={"40px"}
              height={"40px"}
            />
            <p className="hidden tablet:flex font-bold text-4xl">LooksSea</p>
          </div>

          <div className="inline-flex items-center space-x-4">
            <DarkModeButton />
            <Wallet isMobile={true} />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <>
                  <TemporaryDrawer />
                  <AiOutlineMenu className="-mt-1" size="36" />
                </>
              ) : (
                <AiOutlineMenu className="-mt-1" size="36" /> // -mt-1 is there to align this icon with the others
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const NavbarSocialButton = ({ text, path, icon }: NavbarSocialButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="inline-flex"
      onClick={() => window.open(path, "_blank")}
    >
      <>
        {icon}
        {text}
      </>
    </motion.button>
  );
};

const NavbarButton = ({ text, path }: NavbarButtonProps) => {
  return (
    <Link href={path} passHref>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="items-center py-2 px-6 mx-0 mt-2 mb-0 font-semibold text-center normal-case whitespace-nowrap bg-none rounded-full border-2 border-solid cursor-pointer box-border border-stone-500 bg-zinc-800 text-stone-200 hover:border-neutral-600"
      >
        {text}
      </motion.div>
    </Link>
  );
};

export default function TemporaryDrawer() {
  const [state, setState] = useState(true); // The drawer is open by default

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const list = () => (
    <Box>
      <List>
        {["Create an NFT", "Marketplace", "My collection"].map(
          (text, index) => (
            <ListItemButton key={text}>
              {index === 0 && (
                <Link href="/MinterPage" passHref>
                  <button className="inline-flex">
                    <ListItemIcon>
                      <AddCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </button>
                </Link>
              )}
              {index === 1 && (
                <Link href="/MarketplacePage" passHref>
                  <button className="inline-flex">
                    <ListItemIcon>
                      <SwapHorizIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </button>
                </Link>
              )}

              {index === 2 && (
                <Link href="/MyCollectionPage" passHref>
                  <button className="inline-flex">
                    <ListItemIcon>
                      <CollectionsIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </button>
                </Link>
              )}
            </ListItemButton>
          )
        )}
      </List>
      <Divider />
      <List>
        {["Github", "Twitter"].map((text, index) => (
          <ListItemButton key={text}>
            {index === 0 ? (
              <button
                className="inline-flex"
                onClick={() =>
                  window.open("https://github.com/HashRei", "_blank")
                }
              >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </button>
            ) : (
              <button
                className="inline-flex"
                onClick={() =>
                  window.open("https://twitter.com/HashRei_", "_blank")
                }
              >
                <ListItemIcon>
                  <TwitterIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </button>
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor="right"
        open={state}
        onClose={toggleDrawer(false)} // Close the drawer
      >
        {list()}
      </Drawer>
    </div>
  );
}
