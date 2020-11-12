<?php

session_start();

$output = shell_exec("dir /dev/serial/by-id/*");

echo $output;
