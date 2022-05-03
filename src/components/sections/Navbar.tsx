import Image from "next/image";
import Link from "next/link";
import { Wallet } from "../../blockchain/Wallet";

import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
export function Navbar() {
  return (
    <section>

      {/* DesktopNavbar */}

      <div className=" hidden desktop:flex fixed flex-col w-full items-center space-y-3 desktop:flex-row justify-between  ">
        <div className="flex p-2 space-x-3">
          {/* The Image below generates "Warning: Prop `style` did not match" an erro in the console */}
          <Image
            src="/Logo_LooksSea.png"
            alt="LooksSea logo"
            width={"40px"}
            height={"40px"}
          />
          <p className="font-bold text-4xl">LooksSea</p>
        </div>
        <div className="display-mobile">
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 600,
            }}
          >
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search LooksSea"
              inputProps={{ "aria-label": "search looksSea" }}
            />
          </Paper>
        </div>

        <Link href="/">My collection</Link>
        <Link href="/">Mint and sell</Link>

        <Wallet />
      </div>

      {/* MobileNavbar */}

      <div className=" fixed flex-col w-full items-center space-y-3 flex justify-between desktop:hidden ">
        <div className="tablet:flex tablet:justify-around tablet:w-full">
          <div className="flex p-2 space-x-3">
            {/* The Image below generates "Warning: Prop `style` did not match" an erro in the console */}
            <Image
              src="/Logo_LooksSea.png"
              alt="LooksSea logo"
              width={"40px"}
              height={"40px"}
            />
            <p className="font-bold text-4xl">LooksSea</p>
          </div>
          <Wallet />
        </div>

        <Link href="/">My collection</Link>
        <Link href="/">Mint and sell</Link>
      </div>
    </section>
  );
}
