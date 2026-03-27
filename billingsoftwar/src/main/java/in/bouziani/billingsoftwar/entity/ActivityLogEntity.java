package in.bouziani.billingsoftwar.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., "ORDER_CREATED", "CATEGORY_ADDED", "USER_LOGIN"
    @Column(nullable = false)
    private String action;

    // e.g., "Admin created order #ORD177448236"
    @Column(nullable = false)
    private String description;

    // The email or name of the user who performed the action
    @Column(nullable = false)
    private String userEmail;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}