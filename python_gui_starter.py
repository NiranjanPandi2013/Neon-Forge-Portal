import tkinter as tk
from tkinter import messagebox


def on_download():
    messagebox.showinfo("Download", "Downloading software package...")


root = tk.Tk()
root.title("Holo Software Hub")
root.geometry("520x360")
root.config(bg="#0f1024")

button = tk.Button(
    root,
    text="Download Now",
    command=on_download,
    bg="#ff66b2",
    fg="#050817",
    font=("Segoe UI", 12, "bold"),
    activebackground="#ff97d1",
)
button.pack(pady=40)

root.mainloop()
