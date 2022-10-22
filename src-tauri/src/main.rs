#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]


fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
  .plugin(tauri_plugin_window_state::Builder::default().build())
  .menu(tauri::Menu::os_default(&context.package_info().name))
  .run(context)
  .expect("error while running tauri application");
}

// Use this when building Windows application for production and remove window in tauri.conf.json
/* use tauri::{window::WindowBuilder, WindowUrl};
fn main() {
  let port = portpicker::pick_unused_port().expect("failed to find unused port");
  tauri::Builder::default()
    .plugin(tauri_plugin_localhost::Builder::new(port).build())
    .setup(move |app| {
      WindowBuilder::new(
        app,
        "main".to_string(),
        WindowUrl::External(format!("http://localhost:{}", port).parse().unwrap()),
      )
      .title("Localhost Example")
      .build()?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
} */