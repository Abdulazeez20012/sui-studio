# 🧪 Quick Test Guide - Phase 1

## ⚡ 5-Minute Test

### Test the Desktop App Now!

The Electron app should be running with all new features. Here's what to test:

---

## 1️⃣ Open a Folder (30 seconds)

**Steps:**
1. Look at the header - see the **"Open"** button? (new!)
2. Click **"Open"**
3. Select any folder with files
4. Files appear in explorer ✅

**Expected:**
- Native folder picker opens
- Files load in tree view
- Folder name shows in status bar (bottom left)

---

## 2️⃣ Create a New File (30 seconds)

**Steps:**
1. Right-click in file explorer
2. Click **"New File"**
3. Enter name: `test.move`
4. File opens in editor ✅

**Expected:**
- Prompt asks for filename
- File appears in explorer
- File opens with empty content
- **Check your disk - file actually exists!**

---

## 3️⃣ Edit and Save (1 minute)

**Steps:**
1. Type some code in the editor
2. Press **Ctrl+S** (or Cmd+S on Mac)
3. Check console - see "File saved" message ✅

**Expected:**
- File saves to disk
- Console shows confirmation
- **Check your disk - changes are saved!**

---

## 4️⃣ Create a Folder (30 seconds)

**Steps:**
1. Right-click in explorer
2. Click **"New Folder"**
3. Enter name: `contracts`
4. Folder appears ✅

**Expected:**
- Prompt asks for folder name
- Folder appears in tree
- **Check your disk - folder exists!**

---

## 5️⃣ Rename a File (30 seconds)

**Steps:**
1. Right-click any file
2. Click **"Rename"**
3. Enter new name
4. Press Enter ✅

**Expected:**
- File renames in explorer
- **Check your disk - file is renamed!**

---

## 6️⃣ Delete a File (30 seconds)

**Steps:**
1. Right-click any file
2. Click **"Delete"**
3. Confirm deletion ✅

**Expected:**
- Confirmation dialog appears
- File disappears from explorer
- Tab closes if file was open
- **Check your disk - file is deleted!**

---

## 7️⃣ Auto-Save Test (1 minute)

**Steps:**
1. Open a file
2. Make some changes
3. Wait 5 seconds
4. **Don't press Ctrl+S!**
5. Check your disk ✅

**Expected:**
- File automatically saves after 5 seconds
- No user action needed
- **Check your disk - changes are saved!**

---

## 8️⃣ Save All Test (1 minute)

**Steps:**
1. Open 2-3 files
2. Make changes to all of them
3. Press **Ctrl+Shift+S**
4. Check console ✅

**Expected:**
- Console shows "All files saved"
- All files saved to disk
- **Check your disk - all changes saved!**

---

## ✅ Success Checklist

After testing, you should be able to:

- [ ] Open folders from your computer
- [ ] See files in the explorer
- [ ] Create new files that persist
- [ ] Create new folders that persist
- [ ] Edit files
- [ ] Save files with Ctrl+S
- [ ] Save all files with Ctrl+Shift+S
- [ ] Auto-save works (wait 5 seconds)
- [ ] Rename files/folders
- [ ] Delete files/folders
- [ ] Close and reopen - everything persists!

---

## 🎉 If All Tests Pass:

**Congratulations!** Your desktop IDE now has:
- ✅ Full file system integration
- ✅ Professional file management
- ✅ Keyboard shortcuts
- ✅ Auto-save
- ✅ Production-ready!

---

## 🐛 If Something Doesn't Work:

### Common Issues:

**1. "Open Folder" button not visible**
- Make sure you're in the Electron app (not browser)
- Check if `window.electron.isElectron` is true

**2. Files not persisting**
- Check if you opened a folder first
- Check folder permissions
- Look at console for errors

**3. Ctrl+S not working**
- Make sure you have a folder open
- Check if file has changes (isDirty)
- Look at console for "File saved" message

**4. Can't create files**
- Check folder permissions
- Make sure you entered a valid filename
- Look at console for errors

---

## 📊 What Changed?

### Before:
```
❌ Files only in memory
❌ Lost on refresh
❌ Can't save to disk
```

### After:
```
✅ Real file system access
✅ Persistent storage
✅ Professional IDE experience
```

---

## 🚀 Next: Terminal Integration

Once you've tested everything, we can move to **Phase 2**:
- Execute real commands
- Run `sui move build`
- Run `sui move test`
- Real-time output

**Ready?** Let me know how the tests go! 🎯
