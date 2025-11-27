package com.myjobs.controller;

import com.myjobs.dto.ApiResponse;
import com.myjobs.dto.UserDTO;
import com.myjobs.entity.User;
import com.myjobs.enums.Role;
import com.myjobs.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        User currentUser = userService.getCurrentUser();
        UserDTO userDTO = userService.convertToDTO(currentUser);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserDTOById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable Role role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String q) {
        List<UserDTO> users = userService.searchUsers(q);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.MODERADOR) {
            return ResponseEntity.status(403).build();
        }
        UserDTO updatedUser = userService.updateProfile(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado correctamente"));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<UserDTO> toggleUserActive(@PathVariable Long id) {
        UserDTO userDTO = userService.toggleUserActive(id);
        return ResponseEntity.ok(userDTO);
    }
}
